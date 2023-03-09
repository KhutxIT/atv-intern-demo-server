const { Post } = require('../../models/v2');

const countPosts = async (_id, { query }) => {
  query = query?.trim();

  if (query) {
    return await Post.count({
      user: _id,
    });
  }

  return await Post.count({
    user: _id,
  });
};

const searchPosts = async (_id, { query, limit, offset }) => {
  offset = offset || 0;
  limit = limit || 10;
  query = query?.trim();

  if (query) {
    return await Post.find({
      user: _id,
    })
      .limit(limit)
      .skip(offset);
  }

  return await Post.find({
    user: _id,
  })
    .limit(limit)
    .skip(offset);
};

module.exports = {
  countPosts,
  searchPosts,
};
