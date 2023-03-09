const { Server } = require('socket.io');
const { appInit, appDisconenct } = require('./app-socket');
const config = require('config');
const { sendFriendRequest, removeFriendRequest } = require('./user-socket');
const { onTyping, stoppedTyping } = require('./message-socket');
// const { sendMessage, fetchMessages } = require('./message-socket')
// const { fetchUserChats, getDirectChat, searchChat, readChat, joinChat } = require('./chat-socket')
// const { fetchProfile } = require('./user-socket')

const socketEventListening =
  (handler, io, socket) =>
  (...params) =>
    handler(io, socket, ...params);

/**
 *
 * @param {Server} io
 */
module.exports = (io) => {
  // Binding event
  io.on('connection', async (socket) => {
    console.log(
      `👾 New socket connected! >> userId: ${
        socket.decoded_token?._id
      }, socketId : ${socket.id}, at: ${new Date().toLocaleString()}`
    );

    await appInit(io, socket, null, () => {});

    socket.on('disconnect', socketEventListening(appDisconenct, io, socket));

    socket.on(
      '@newFriendRequest',
      socketEventListening(sendFriendRequest, io, socket)
    );

    socket.on(
      '@removeFriendRequest',
      socketEventListening(removeFriendRequest, io, socket)
    );

    socket.on('@typing', socketEventListening(onTyping, io, socket));

    socket.on(
      '@stoppedTyping',
      socketEventListening(stoppedTyping, io, socket)
    );
  });
  return io;
};
