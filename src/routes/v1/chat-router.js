const express = require('express');
const router = express.Router();
const { ChatController } = require('../../controllers/v1');
const { AuthMiddleware } = require('../../middlewares');

router.post(
  '/getChatRooms/',
  AuthMiddleware.verifyUser,
  ChatController.getChatRooms
);

router.post(
  '/getMessagesForRoom',
  AuthMiddleware.verifyUser,
  ChatController.getMessagesForRoom
);

router.post(
  '/sendImage',
  AuthMiddleware.verifyUser,
  ChatController.checkRoom,
  ChatController.createImageMessage
);

router.post(
  '/sendMessage',
  AuthMiddleware.verifyUser,
  ChatController.checkRoom,
  ChatController.sendMessage
);

router.post(
  '/readMessages',
  AuthMiddleware.verifyUser,
  ChatController.checkRoom,
  ChatController.readMessages
);

module.exports = router;
