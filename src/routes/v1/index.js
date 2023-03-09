const router = require('express').Router();
const userRouter = require('./user-router');
const postRouter = require('./post-router');
const mediaRouter = require('./media-router');
const notificationRouter = require('./notification-router');
const commentRouter = require('./comment-router');

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/medias', mediaRouter);
router.use('/notifications', notificationRouter);
router.use('/comments', commentRouter);


// admin route
const adminRouter = require('./admin-router');

router.use('/admin', adminRouter);

module.exports = router;
