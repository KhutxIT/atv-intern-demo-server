const { UserService, FriendRequestService } = require('../services/v1');
const { getSocketIdsByUserId } = require('./app-socket');

const sendFriendRequest = async (io, socket, data, cb) => {
  try {
    const { userSentId, userReceivedId } = data;
    const friendRequest = await FriendRequestService.newFriendRequest(
      userSentId,
      userReceivedId
    );
    const user = await UserService.getUser(userSentId);
    const userReceivedSocketIds = getSocketIdsByUserId(userReceivedId);
    for (const id of userReceivedSocketIds)
      socket.to(id).emit('@newFriendRequest', socket.id, friendRequest);
    cb(user);
  } catch (err) {
    cb({ err: err.message });
  }
};

const removeFriendRequest = async (io, socket, data, cb) => {
  try {
    const { userSentId, userReceivedId } = data;
    await FriendRequestService.removeFriendRequest(userSentId, userReceivedId);
    const user = await UserService.getUser(userSentId);
    const userReceivedSocketIds = getSocketIdsByUserId(userReceivedId);
    for (const id of userReceivedSocketIds)
      socket.to(id).emit('@removeFriendRequest', socket.id);
    cb(user);
  } catch (err) {
    cb({ err: err.message });
  }
};

module.exports = {
  sendFriendRequest,
  removeFriendRequest,
};
