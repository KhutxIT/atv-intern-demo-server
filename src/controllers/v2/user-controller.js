const { UserService, PostService } = require('../../services/v2');
const catchAsync = require('../../utils/catchasync-util');
const { User, Notification, Post, Message } = require('../../models/v2');
const mongoose = require('mongoose');

const getPersonalData = catchAsync(async (req, res) => {
  const { _id } = req.user;

  const result = await UserService.getPersonalData(_id);
  res.json({
    data: result,
  });
});

const getPosts = catchAsync(async (req, res) => {
  const { userId, lastPostId } = req.query;

  const result = await UserService.getPosts(userId, lastPostId);
  res.json({
    data: result,
  });
});

module.exports = {
  getPersonalData,
  getPosts,
};
