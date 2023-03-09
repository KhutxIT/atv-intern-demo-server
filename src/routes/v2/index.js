const router = require('express').Router();
const postRouter = require('./post-router');
const userRouter = require('./user-router')

router.use('/posts', postRouter);
router.use('/users', userRouter);

module.exports = router;
