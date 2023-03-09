const { Server, Socket } = require('socket.io');
const { User } = require('../models/v2');
const { updateTotalSignIn } = require('../services/system-operation-service');
const { UserService } = require('../services/v1');

const userSockets = {};
/**
 * Client call this when init their app
 * @param {Server} io
 * @param {Socket} socket
 * @param {any} chats
 * @param {any} cb
 */
const appInit = async (io, socket, data, cb) => {
  try {
    const { decoded_token } = socket;

    const userId = decoded_token?._id;
    if (userId) {
      const sockets = userSockets[userId] || [];
      sockets.push(socket.id);
      userSockets[userId] = [...new Set(sockets)];

      let user = await User.findOneAndUpdate(
        { _id: userId },
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
      await updateTotalSignIn();
      user = user.toObject();
      let userReceivedSocketIds;
      for (let userID of user.friends) {
        userReceivedSocketIds = getSocketIdsByUserId(userID);
        for (const id of userReceivedSocketIds) {
          io.sockets.in(id).emit('@activityStatusUpdate', {
            activityStatus: user.activityStatus,
            user,
          });
        }
      }
    }

    cb({});
  } catch (err) {
    cb({ err: err.message });
  }
};

const appDisconenct = async (io, socket, data, cb) => {
  const { decoded_token } = socket;
  const userId = decoded_token?._id;
  if (userId) {
    const index = (userSockets[userId] || [])
      .map((x) => `${x}`)
      .indexOf(`${socket.id}`);

    if (index > -1) {
      userSockets[userId].splice(index, 1);

      let user = await User.findOneAndUpdate(
        { _id: userId },
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
      user = user.toObject();
      let userReceivedSocketIds;
      for (let userID of user.friends) {
        userReceivedSocketIds = getSocketIdsByUserId(userID);
        for (const id of userReceivedSocketIds) {
          io.sockets.in(id).emit('@activityStatusUpdate', {
            activityStatus: user.activityStatus,
            user,
          });
        }
      }
    }
  }
};

// /**
//  * Client call this when init their app
//  * @param {Server} io
//  * @param {Socket} socket
//  * @param {any} chats
//  * @param {any} cb
//  */
// const login = (io, socket, data, cb) => {
//   try {
//     cb({})
//   } catch (err) {
//     cb({ err: err.message })
//   }
// }

// /**
//  *
//  * @param {Server} io
//  * @param {String} userId
//  * @returns {Array<Socket>}
//  */
// const getSocketsByUser = (io, user, cb) => {
//   const userId = user?._id || user
//   if (!userId) return []

//   const result = (userSockets[userId] || [])
//     .map(socketId => io.sockets.sockets.get(socketId))
//     .filter(x => !!x)

//   return result
// }

const getSocketIdsByUserId = (userId) => {
  if (!userId) return [];

  const result = userSockets[userId] || [];

  return result;
};

module.exports = {
  appInit,
  // login,
  // getSocketsByUser,
  getSocketIdsByUserId,
  appDisconenct,
};
