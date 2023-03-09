const { FriendRequest } = require('../../models/v2');

const newFriendRequest = async (userSentId, userReceivedId) => {
  if (await FriendRequest.findOne({ userSentId, userReceivedId }))
    throw new InvalidResourceException('Đã tồn tại lời mời kết bạn');
  const friendRequest = new FriendRequest({ userSentId, userReceivedId });
  const result = await friendRequest.save();

  return result;
};

const removeFriendRequest = async (userSentId, userReceivedId) => {
  const result = await FriendRequest.deleteOne({
    userSentId,
    userReceivedId,
  });

  return result;
};

const getFriendRequestSentList = async (_id) => {
  const result = await FriendRequest.find({
    userSentId: _id,
    isWatingConfirm: true,
  });

  return result;
};

module.exports = {
  newFriendRequest,
  removeFriendRequest,
  getFriendRequestSentList,
};
