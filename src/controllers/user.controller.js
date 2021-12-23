const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ message: 'Successfully!'});
});

const getUsers = catchAsync(async (req, res) => {
  let users = await userService.getAll();
  res.status(httpStatus.OK).send(users);
});

const getUser = catchAsync(async (req, res) => {
  let user = await userService.getUserByPk(req.params.userId);
  res.status(httpStatus.OK).send(user);
});

const updateUser = catchAsync(async (req, res) => {
  await userService.updateUserById(req.params.userId, req.body);
  res.status(httpStatus.OK).send({ message: 'Successfully!'});
});

const deleteByUpdateUserStatus = catchAsync(async (req, res) => {
  await userService.updateUserStatus(req.params.userId, 2);
  res.status(httpStatus.OK).send({ message: 'Successfully!'});
});

module.exports = {
  createUser,
  getUsers,
  deleteByUpdateUserStatus,
  getUser,
  updateUser
}