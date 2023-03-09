const { PostController } = require('../../controllers/v1');
const { AuthMiddleware } = require('../../middlewares');

const router = require('express').Router();

router
  .route('/:_id')
  .get(AuthMiddleware.verifyUser, PostController.searchPosts);

router
  .route('/count/:_id')
  .get(AuthMiddleware.verifyUser, PostController.countUsers);

router.post('/getPosts', AuthMiddleware.verifyUser, PostController.getPosts);

router.post(
  '/getPostLikes',
  AuthMiddleware.verifyUser,
  PostController.getPostLikes
);

router.post('/getPost', AuthMiddleware.verifyUser, PostController.getPost);

router.post('/likePost/', AuthMiddleware.verifyUser, PostController.likePost);

router.post('/delete/', AuthMiddleware.verifyUser, PostController.deletePost);

module.exports = router;
