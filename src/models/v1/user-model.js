const Mongoose = require('mongoose');
const { VIETNAM_PHONE_REGEX } = require('../constant/regex');
const { Schema } = Mongoose;
const config = require('config');

const userSchema = new Schema(
  {
    phone: {
      type: String,
      match: VIETNAM_PHONE_REGEX,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      select: false,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
      default: `${config.imgSrc}/images/avatar/default.png`,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    birthday: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
    },
    chats: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      },
    ],

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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = Mongoose.model('User', userSchema);
