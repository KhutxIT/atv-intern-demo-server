const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('config');

const postLikeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Post',
  },
});

const commentLikeSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Comment',
  },
});

const commentReplyLikeSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Reply',
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  username: {
    type: String,
    minlength: 3,
    maxlength: 30,
    trim: true,
    match:
      /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
  },
  bio: {
    type: String,
    default: '',
    trim: true,
    maxlength: 250,
  },
  // email: {
  //   type: String,
  //   trim: true,
  //   maxlength: 40,
  //   unique: true,
  //   match:
  //     /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  // },
  password: {
    trim: true,
    minlength: 3,
    type: String,
    required: true,
    select: false,
  },
  birthday: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    default: `${config.imgSrc}/images/avatar/default.png`,
  },
  activityStatus: {
    type: String,
    default: 'offline',
  },
  accountStatus: {
    type: String,
    default: 'active',
  },
  postLikes: [postLikeSchema],
  commentLikes: [commentLikeSchema],
  commentReplyLikes: [commentReplyLikeSchema],
  // danh sách người đang theo dõi mình
  followers: [this],
  // danh sách người mình đang theo dõi
  followings: [this],
  // danh sách bạn bè
  friends: [this],

  lastOnline: {
    type: Date,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
});

UserSchema.index({ username: 'text', name: 'text' });

module.exports = mongoose.model('User', UserSchema);
