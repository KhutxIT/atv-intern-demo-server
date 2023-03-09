const { UserController } = require('../../controllers/v2');
const { AuthMiddleware } = require('../../middlewares');

const router = require('express').Router();

// Profile
router
  .route('/profile')
  .get(AuthMiddleware.verifyUser, UserController.getPersonalData);

router
  .route('/posts')
  .get(AuthMiddleware.verifyUser, UserController.getPosts);

module.exports = router;
