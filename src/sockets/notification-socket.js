const { io } = require('../infrastructure/socket-manager');
const { getSocketIdsByUserId } = require('./app-socket');

const sendAddCommentNotification = (req, values) => {
  if (req.user._id != req.body.authorId) {
    const { profilePicture, username } = values[0];
    const {
      _id,
      read,

      post,
      type,
      comment,
      reply,
      createdAt,
    } = values[1];

    const userReceivedSocketIds = getSocketIdsByUserId(req.body.authorId);
    for (const id of userReceivedSocketIds)
      io.sockets.in(id).emit('@newNotification', {
        notification: {
          _id,
          read,
          sender: [
            {
              profilePicture,
              username,
            },
          ],

          post: [{ ...post }],
          comment: [{ ...comment }],
          reply: [{ ...reply }],
          type,
          createdAt,
        },
      });
  }
};

const sendFollowNotification = (userFollow, userFollowedId, notification) => {
  const { profilePicture, username } = userFollow;
  const { _id, read, type, createdAt } = notification;
  const userReceivedSocketIds = getSocketIdsByUserId(userFollowedId);
  for (const id of userReceivedSocketIds)
    io.sockets.in(id).emit('@newNotification', {
      notification: {
        _id,
        read,
        type,
        sender: [
          {
            profilePicture,
            username,
          },
        ],
        createdAt,
      },
    });
};

const sendLikeCommenNotification = (req, values) => {
  if (req.user._id != req.body.authorId) {
    const { profilePicture, username } = values[0];
    const { _id, read, comment, post, type, createdAt } = values[1];
    const userReceivedSocketIds = getSocketIdsByUserId(req.body.authorId);
    for (const id of userReceivedSocketIds)
      io.sockets.in(id).emit('@newNotification', {
        notification: {
          _id,
          read,
          comment: [{ ...comment }],
          post: [{ ...post }],
          type,
          sender: [
            {
              profilePicture,
              username,
            },
          ],
          createdAt,
        },
      });
  }
};

module.exports = {
  sendAddCommentNotification,
  sendFollowNotification,
  sendLikeCommenNotification,
};
