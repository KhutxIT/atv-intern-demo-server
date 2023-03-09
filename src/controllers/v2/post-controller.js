const { PostService } = require('../../services/v2');
const catchAsync = require('../../utils/catchasync-util');
const { updateTotalNewPost } = require('../../services/system-operation-service');

const createPost = catchAsync(async (req, res, next) => {
  let post = req.body;
  const { _id } = req.user;
  post = { ...post, author: _id };
  if (req.fileSrcUrl) post = { ...post, photo: req.fileSrcUrl };
  const result = await PostService.createPost(req.user, post);
  await updateTotalNewPost();
  res.json({
    data: result,
  });
});

const getPosts = catchAsync(async (req, res, next) => {
  let { initialFetch, lastPostId } = req.query;
  const result = await PostService.getPosts({
    initialFetch,
    lastPostId,
    user: req.user,
  });

  res.json({
    data: result,
  });
});

const getPersonalPosts = catchAsync(async (req, res, next) => {
  const { lastPostId } = req.query;
  const { _id } = req.user;
  const result = await PostService.getPersonalPosts(_id, lastPostId);

  res.json({
    data: result,
  });
});

const getAllUserPosts = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const result = await PostService.getAllUserPosts(userId);

  res.json({
    data: result,
  });
});

module.exports = {
  createPost,
  getPosts,
  getPersonalPosts,
  getAllUserPosts
};
