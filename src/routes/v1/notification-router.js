const { NotificationController } = require('../../controllers/v1');
const { AuthMiddleware } = require('../../middlewares');

const router = require('express').Router();

router
  .route('/')
  .get(AuthMiddleware.verifyUser, NotificationController.getNotifications)
  .put(AuthMiddleware.verifyUser, NotificationController.readNotifications);

module.exports = router;
