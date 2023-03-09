const { CommentController } = require('../../controllers/v1');
const { AuthMiddleware } = require('../../middlewares');

const router = require('express').Router();

router.route('/').post(AuthMiddleware.verifyUser, CommentController.addComment);

router.post(
  "/getComments/",
  CommentController.getCommentsForPost
);

router.post(
  "/getCommentReplies/",
  AuthMiddleware.verifyUser,
  CommentController.getRepliesForComment
);

router.post(
  "/addComment/",
  AuthMiddleware.verifyUser,
  CommentController.addComment
);

router.post(
  "/addCommentReply/",
  AuthMiddleware.verifyUser,
  CommentController.addCommentReply
);

router.post(
  "/getCommentLikes",
  AuthMiddleware.verifyUser,
  CommentController.getCommentLikes
);

router.post(
  "/getCommentReplyLikes",
  AuthMiddleware.verifyUser,
  CommentController.getCommentReplyLikes
);

router.post(
  "/likeComment/",
  AuthMiddleware.verifyUser,
  CommentController.likeComment
);

module.exports = router;
