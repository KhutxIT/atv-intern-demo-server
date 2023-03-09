const { MediaController } = require('../../controllers/v1');
const { PostController } = require('../../controllers/v2');
const { AuthMiddleware } = require('../../middlewares');

const router = require('express').Router();

router
  .route('/')
  .get(AuthMiddleware.verifyUser, PostController.getPosts)
  .post(
    AuthMiddleware.verifyUser,
    MediaController.uploadMediaMiddleware,
    PostController.createPost
  );

router
  .route('/:userId')
  .get(AuthMiddleware.verifyUser, PostController.getAllUserPosts);

router
  .route('/personal')
  .get(AuthMiddleware.verifyUser, PostController.getPersonalPosts);

module.exports = router;
