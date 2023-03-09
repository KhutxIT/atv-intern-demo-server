const { InvalidResourceException } = require('../../exceptions');
const { FriendRequest } = require('../../models/v2');
const { updateTotalNewUser } = require('../../services/system-operation-service');
const { UserService, FriendRequestService } = require('../../services/v1');
const catchAsync = require('../../utils/catchasync-util');

const login = catchAsync(async (req, res) => {
  const result = await UserService.login(req.body);

  res.json({
    data: result,
  });
});

const signup = catchAsync(async (req, res) => {
  let user = req.body;
  user.role = 'USER';

  user = await UserService.signUp(user);
  await updateTotalNewUser();
  res.json({
    data: user,
  });
});

const fetchProfile = catchAsync(async (req, res) => {
  const { user } = req;
  const result = await UserService.fetchProfile(user._id);
  res.json({
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const _id = req.body._id || req.user._id;
  let result;
  if (req.fileSrcUrl)
    result = await UserService.updateProfile({
      ...req.body,
      profilePicture: req.fileSrcUrl,
      _id,
    });
  else result = await UserService.updateProfile(req.body);

  res.json({
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await UserService.getUser(userId);
  res.json({
    data: user,
  });
});

const fetchUserChats = async (req, res, next) => {
  try {
    const result = await UserService.fetchUserChats(req.user);

    req.data = result;
    req.message = 'Update profile successfully';

    next();
  } catch (err) {
    next(err);
  }
};

const searchUser = catchAsync(async (req, res) => {
  const { query, limit, offset } = req.query;
  const result = await UserService.fetchUsers({ query, limit, offset });
  const { user } = req;
  const index = result.findIndex((ele) => ele._id.toString() === user._id.toString());
  if (index > -1) result.splice(index, 1);

  res.json({
    data: result,
  });
});

const searchUserByName = catchAsync(async (req, res) => {
  const { query, limit, offset } = req.query;
  const result = await UserService.fetchUsersByName({ query, limit, offset });
  const { user } = req;
  const index = result.findIndex((ele) => ele._id == user._id);
  if (index > -1) result.splice(index, 1);

  res.json({
    data: result,
  });
});

const searchUserByUsername = catchAsync(async (req, res) => {
  const { query, limit, offset } = req.query;
  const result = await UserService.fetchUsersByUserName({ query, limit, offset });
  const { user } = req;
  const index = result.findIndex((ele) => ele._id == user._id);
  if (index > -1) result.splice(index, 1);

  res.json({
    data: result,
  });
});

const countUsers = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const result = await UserService.countUsers({ query });

  res.json({
    data: result - 2,
  });
});

const newFollowing = catchAsync(async (req, res, next) => {
  const { userFollowId, userFollowedId } = req.body;
  if (userFollowId != req.user._id) {
    next(
      new InvalidResourceException(
        'Thông tin id người theo dõi không chính xác'
      )
    );
    return;
  }
  const result = await UserService.newFollow(userFollowId, userFollowedId);

  res.json({
    data: result,
  });
});

const unFollow = catchAsync(async (req, res, next) => {
  const { userFollowId, userFollowedId } = req.body;
  if (userFollowId != req.user._id) {
    next(
      new InvalidResourceException(
        'Thông tin id người theo dõi không chính xác'
      )
    );
    return;
  }
  const result = await UserService.unFollow(userFollowId, userFollowedId);

  res.json({
    data: result,
  });
});

const getFollowerList = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserService.getFollowerList(userId);

  res.json({
    data: result,
  });
});

const getFollowingList = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserService.getFollowingList(userId);

  res.json({
    data: result,
  });
});

const getUsersSentFriendRequestToMe = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await UserService.getUsersSentFriendRequestToMe(_id);

  res.json({
    data: result,
  });
});

const confirmFriendRequest = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { userSentFriendRequestId } = req.query;
  const result = await UserService.confirmFriendRequest(
    _id,
    userSentFriendRequestId
  );

  res.json({
    data: result,
  });
});

const unFriend = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { userUnFriended } = req.query;
  const result = await UserService.unFriend(_id, userUnFriended);

  res.json({
    data: result,
  });
});

const rejectFriendRequest = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { userSentFriendRequestId } = req.query;
  await FriendRequestService.removeFriendRequest(userSentFriendRequestId, _id);
  const result = await UserService.getUser(_id);

  res.json({
    data: result,
  });
});

const getFriends = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await UserService.getFriends(_id);

  res.json({
    data: result,
  });
});

module.exports = {
  login,
  signup,
  fetchProfile,
  updateProfile,
  fetchUserChats,
  searchUser,
  getUser,
  countUsers,
  newFollowing,
  unFollow,
  getFollowerList,
  getFollowingList,
  getUsersSentFriendRequestToMe,
  confirmFriendRequest,
  rejectFriendRequest,
  getFriends,
  unFriend,
  searchUserByName,
  searchUserByUsername
};
