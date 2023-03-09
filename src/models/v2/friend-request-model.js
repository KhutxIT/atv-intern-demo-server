const Mongoose = require('mongoose');

const friendRequestSchema = new Mongoose.Schema(
  {
    userSentId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userReceivedId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isWatingConfirm: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = Mongoose.model('FriendRequest', friendRequestSchema);
