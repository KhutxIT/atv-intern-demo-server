const { io } = require('../infrastructure/socket-manager');
const { getSocketIdsByUserId } = require('./app-socket');

const sendRoom = (data) => {
  const userReceivedSocketIds = getSocketIdsByUserId(data.userId);
  const { userId, room } = data;
  for (const id of userReceivedSocketIds) {
    io.sockets.in(id).emit('@newRoom', {
      ...room,
      lastMessage: [],
    });
  }
};

const sendMessage = (data) => {
  const { message, receiver } = { ...data };
  const userReceivedSocketIds = getSocketIdsByUserId(receiver._id);
  for (const id of userReceivedSocketIds) {
    io.sockets.in(id).emit('@newMessage', {
      ...message,
    });
  }
};

const sendReadMessage = (data) => {
  const { messageIds, roomId, receiver } = { ...data };
  const userReceivedSocketIds = getSocketIdsByUserId(receiver);
  for (const id of userReceivedSocketIds) {
    io.sockets.in(id).emit('@readMessages', {
      messageIds,
      roomId,
    });
  }
};

const onTyping = async (io, socket, data, cb) => {
  try {
    const { userId, roomId } = data;
    const userReceivedSocketIds = getSocketIdsByUserId(userId);
    for (const id of userReceivedSocketIds)
      socket.to(id).emit('@typing', { roomId: roomId });
    cb({});
  } catch (err) {
    cb({ err: err.message });
  }
};

const stoppedTyping = async (io, socket, data, cb) => {
  try {
    const { userId, roomId } = data;
    const userReceivedSocketIds = getSocketIdsByUserId(userId);
    for (const id of userReceivedSocketIds)
      socket.to(id).emit('@stoppedTyping', { roomId: roomId });
    cb({});
  } catch (err) {
    cb({ err: err.message });
  }
};

const sendActivityStatus = (data) => {
  const { req, user, userId, activityStatus } = data;
  const io = req.app.get('socketio');
  io.sockets.in(userId).emit('activityStatusUpdate', {
    activityStatus,
    user,
  });
};

module.exports = {
  sendRoom,
  sendMessage,
  sendReadMessage,
  onTyping,
  stoppedTyping,
};
