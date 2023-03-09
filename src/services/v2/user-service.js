const PostService = require('./post-service');
const { User, Notification, Post, Message } = require('../../models/v2');
const mongoose = require('mongoose');

const getPersonalData = async (_id) => {
  const user = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(_id) } },
    {
      $project: {
        name: 1,
        username: 1,
        email: 1,
        bio: 1,
        profilePicture: 1,
        gender: 1,
        role: 1,
        followings: 1,
        followers: 1,
        friends: 1,
        activityStatus: 1,
        postLikes: '$postLikes.post',
        commentLikes: '$commentLikes.comment',
        commentReplyLikes: '$commentReplyLikes.comment',
      },
    },
  ]);
  const notificationsCount = await Notification.find({
    receiver: mongoose.Types.ObjectId(_id),
    read: false,
  }).countDocuments();
  const postsCount = await Post.find({
    author: mongoose.Types.ObjectId(_id),
  }).countDocuments();
  const messagesCount = await Message.find({
    receiver: mongoose.Types.ObjectId(_id),
    read: false,
  }).countDocuments();
  const allNotification = await Notification.find({
    receiver: mongoose.Types.ObjectId(_id),
  }).countDocuments();
  const posts = await PostService.getPersonalPosts(_id);

  return {
    ...user[0],
    notificationsCount,
    postsCount,
    messagesCount,
    allNotification,
    posts,
  };
};

const getPosts = async (userId, lastPostId) => {
  const result = await Post.aggregate([
    {
      $match: {
        $and: [
          {
            _id: {
              $lt: mongoose.Types.ObjectId(lastPostId),
            },
            author: mongoose.Types.ObjectId(userId),
          },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    },
    {
      $lookup: {
        from: 'postlikes',
        localField: '_id',
        foreignField: 'post',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'post',
        as: 'comments',
      },
    },

    {
      $project: {
        photo: 1,
        createdAt: 1,
        tags: 1,
        hashtags: 1,
        location: 1,
        likes: {
          $size: { $arrayElemAt: ['$likes.users_likes', 0] },
        },
        comments: {
          $size: '$comments',
        },
        description: 1,
        'author._id': 1,
        'author.username': 1,
        'author.profilePicture': 1,
      },
    },
  ]);
  return result;
};

module.exports = {
  getPersonalData,
  getPosts,
};
