const {
  AppException,
  InvalidResourceException,
  ForbiddenException,
} = require('../../exceptions');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const FriendRequest = mongoose.model('FriendRequest');
const User = mongoose.model('User');
const ChatRoom = mongoose.model('ChatRoom');
const jwt = require('jsonwebtoken');
const config = require('config');
const { sendRoom } = require('../../sockets/message-socket');
const { Notification } = require('../../models/v2');
const { sendFollowNotification } = require('../../sockets/notification-socket');
const { ACCOUNT_STATUS_LOCK } = require('../../common/constant');

const registerToken = (data) => {
  const token = jwt.sign(data, config.tokenSecret, {
    expiresIn: config.tokenExpires,
  });

  return token;
};

const signUp = async (data) => {
  let account = await User.findOne({ username: data.username });
  if (account)
    throw new InvalidResourceException('Tên đăng nhập đã được sử dụng');

  // Gen hash password
  const salt = await bcrypt.genSalt(12);
  const hashPass = await bcrypt.hash(data.password, salt);

  // Update new hash password
  data.password = hashPass;

  // Insert new account to DB
  const user = new User(data);
  const result = await user.save();

  // Remove unecessary fields and return result
  if (result) {
    const account = result.toObject();

    delete account.password;

    const token = registerToken(account);
    return { ...account, token };
  }

  throw new AppException('Something went wrong!');
};

const login = async (data) => {
  const { username, password } = data;
  let account = await User.findOne({ username: username }).select('+password');

  // Do login - Compare password
  if (account) {
    const valid =
      (account?.password &&
        (await bcrypt.compare(password, account.password))) ||
      false;

    if (valid) {
      account = account.toObject();
      if (account.accountStatus === ACCOUNT_STATUS_LOCK) {
        throw new ForbiddenException('Tài khoản đã bị khóa');
      }
      delete account.password;

      const token = registerToken(account);

      return { ...account, token };
    }

    throw new InvalidResourceException('Mật khẩu không chính xác!');
  }

  throw new InvalidResourceException('Tên đăng nhập không chính xác!');
};

const fetchProfile = async (_id) => {
  const result = await User.findById(_id);
  delete result?.password;

  return result;
};

const updateProfile = async (data) => {
  const { _id, username, newUsername } = data;
  if (newUsername) {
    let user = await User.findOne({ username: newUsername });
    if (user && user._id !== _id)
      throw new InvalidResourceException('Tên đăng nhập đã được sử dụng!');
    else data = { ...data, username: newUsername };
  }

  const filter = (_id && { _id }) || (username && { username }) || {};

  const result = await User.findOneAndUpdate(
    filter,
    {
      $set: data,
    },
    { new: true }
  );

  if (!result) {
    throw new AppException('Update profile failed');
  }

  return result;
};

const getUser = async (userId) => {
  const user = await User.findById(userId);
  const totalFriendRequestReceived = await FriendRequest.count({
    userReceivedId: userId,
    isWatingConfirm: true,
  });
  return { ...user.toObject(), totalFriendRequestReceived };
};

const fetchUserChats = async ({ user, query, limit, offset }) => {
  offset = offset || 0;
  limit = limit || 0;

  const { _id } = user;
  const filter = { _id };
  const result = await User.find(filter)
    .populate({
      path: 'chats',
      populate: {
        path: 'users',
      },
    })
    .populate('lastMessage')
    .limit(limit)
    .skip(offset)
    .select('chats');

  return result && result.chats;
};

const fetchUsers = async ({ query, limit, offset }) => {
  offset = offset ? Number.parseInt(offset) : 0;
  limit = limit ? Number.parseInt(limit) : 10;

  if (query) {
    return await User.find({
      $or: [
        { phone: new RegExp('^' + query, 'i') },
        { name: new RegExp('^' + query, 'i') },
        { username: new RegExp('^' + query, 'i') },
      ],
      role: 'USER',
    })
      .sort({ date: -1 })
      .limit(limit)
      .skip(offset);
  }

  return await User.find({ role: 'USER' })
    .sort({ date: -1 })
    .limit(limit)
    .skip(offset);
};

const fetchUsersByName = async ({ query, limit, offset }) => {
  offset = offset || 0;
  limit = limit || 10;

  if (query) {
    return await User.find({ name: new RegExp('^' + query, 'i'), role: 'USER' })
      .limit(limit)
      .skip(offset);
  }

  return await User.find({}).limit(limit).skip(offset);
};

const fetchUsersByUserName = async ({ query, limit, offset }) => {
  offset = offset || 0;
  limit = limit || 10;

  if (query) {
    return await User.find({ username: new RegExp('^' + query, 'i') })
      .limit(limit)
      .skip(offset);
  }

  return await User.find({}).limit(limit).skip(offset);
};

const countUsers = async ({ query }) => {
  query = query?.trim();

  if (query) {
    return await User.count({
      $or: [
        { phone: new RegExp('^' + query, 'i') },
        { name: new RegExp('^' + query, 'i') },
        { username: new RegExp('^' + query, 'i') },
      ],
    });
  }

  return await User.count({});
};

const addChatToUsers = async (chat) => {
  if (!chat) {
    throw new ValidateException('Chat');
  }

  const result = [];
  for (let participant of chat.participants) {
    const _id = participant.user._id || participant.user;
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      {
        $addToSet: {
          chats: chat._id,
        },
      },
      {
        new: true,
      }
    );

    result.push(updatedUser);
  }

  return result;
};

const updateUserOnline = async (data) => {
  const { _id } = data;
  const user = await User.findOneAndUpdate(
    { _id },
    {
      $set: {
        isOnline: true,
        lastOnline: new Date(),
        activityStatus: 'online',
      },
    },
    {
      new: true,
    }
  );

  return user?.toObject();
};

const updateUserOffline = async (data) => {
  const { _id } = data;
  const user = await User.findOneAndUpdate(
    { _id },
    {
      $set: {
        isOnline: false,
        lastOnline: new Date(),
        activityStatus: 'offline',
      },
    },
    {
      new: true,
    }
  );

  return user?.toObject();
};

const newFollow = async (userFollowId, userFollowedId) => {
  const updateUserFollow = await User.findOneAndUpdate(
    { _id: userFollowId },
    {
      $addToSet: {
        followings: userFollowedId,
      },
    },
    {
      new: true,
    }
  );
  await User.findOneAndUpdate(
    { _id: userFollowedId },
    {
      $addToSet: {
        followers: userFollowId,
      },
    },
    {
      new: true,
    }
  );
  const notification = await new Notification({
    sender: userFollowId,
    message: 'vừa theo dõi bạn',
    receiver: userFollowedId,
    type: 'follow',
  }).save();
  sendFollowNotification(updateUserFollow, userFollowedId, notification);
  return updateUserFollow.toObject();
};

const unFollow = async (userFollowId, userFollowedId) => {
  const updateUserFollow = await User.findOneAndUpdate(
    { _id: userFollowId },
    {
      $pull: {
        followings: userFollowedId,
      },
    },
    {
      new: true,
    }
  );
  await User.findOneAndUpdate(
    { _id: userFollowedId },
    {
      $pull: {
        followers: userFollowId,
      },
    },
    {
      new: true,
    }
  );

  return updateUserFollow.toObject();
};

const unFriend = async (userUnFriend, userUnFriended) => {
  const updateUserUnFriend = await User.findOneAndUpdate(
    { _id: userUnFriend },
    {
      $pull: {
        followings: userUnFriended,
        friends: userUnFriended,
      },
    },
    {
      new: true,
    }
  );
  await User.findOneAndUpdate(
    { _id: userUnFriended },
    {
      $pull: {
        friends: userUnFriend,
      },
    },
    {
      new: true,
    }
  );

  return updateUserUnFriend.toObject();
};

const getFollowerList = async (userId) => {
  const user = await User.findById(userId);
  const { followers } = user;
  const result = [];
  for (let userId of followers) {
    result.push(await User.findById(userId));
  }
  return result;
};

const getFollowingList = async (userId) => {
  const user = await User.findById(userId);
  const { followings } = user;
  const result = [];
  for (let userId of followings) {
    result.push(await User.findById(userId));
  }
  return result;
};

const getUsersSentFriendRequestToMe = async (userId) => {
  const friendRequestReceiveds = await FriendRequest.find({
    userReceivedId: userId,
    isWatingConfirm: true,
  });
  const result = [];
  for (let friendRequestReceived of friendRequestReceiveds) {
    result.push(await User.findById(friendRequestReceived.userSentId));
  }

  return result;
};

const confirmFriendRequest = async (_id, userSentId) => {
  await FriendRequest.deleteOne({
    userSentId,
    userReceivedId: _id,
  });
  const result = await User.findOneAndUpdate(
    { _id },
    {
      $addToSet: {
        friends: userSentId,
      },
    },
    {
      new: true,
    }
  );
  await User.findOneAndUpdate(
    { _id: userSentId },
    {
      $addToSet: {
        friends: _id,
      },
    },
    {
      new: true,
    }
  );
  await newFollow(_id, userSentId);
  await newFollow(userSentId, _id);
  const room = await ChatRoom.find({
    members: { $all: [_id, userSentId] },
  });
  if (!room.length) {
    let newRoom = await new ChatRoom({
      members: [userSentId, _id],
    }).save();
    newRoom = await newRoom
      .populate('members', 'username name profilePicture activityStatus')
      .execPopulate();
    sendRoom({ userId: userSentId, room: newRoom.toObject() });
  }

  return result;
};

const getFriends = async (userId) => {
  const user = await User.findById(userId);
  const { friends } = user;
  const result = [];
  for (let userId of friends) {
    result.push(await User.findById(userId));
  }
  return result;
};

exports.updateUserOnline = updateUserOnline;
exports.updateUserOffline = updateUserOffline;

module.exports = {
  login,
  signUp,
  fetchProfile,
  updateProfile,
  fetchUserChats,
  fetchUsers,
  addChatToUsers,
  updateUserOnline,
  updateUserOffline,
  getUser,
  countUsers,
  newFollow,
  unFollow,
  getFollowerList,
  getFollowingList,
  getUsersSentFriendRequestToMe,
  confirmFriendRequest,
  getFriends,
  unFriend,
  fetchUsersByName,
  fetchUsersByUserName,
};
