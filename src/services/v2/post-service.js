const catchAsync = require('../../utils/catchasync-util');
const linkify = require('linkifyjs');
const { Post, User, Notification, PostLike } = require('../../models/v2');
const { InvalidResourceException } = require('../../exceptions');
require('linkifyjs/plugins/hashtag')(linkify);
require('linkifyjs/plugins/mention')(linkify);
const mongoose = require('mongoose');

const postLookup = [
  {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'author',
    },
  },
  {
    $lookup: {
      from: 'postlikes',
      localField: '_id',
      foreignField: 'post',
      as: 'likes',
    },
  },
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'post',
      as: 'comments',
    },
  },
];

const createPost = async (user, post) => {
  const hashtags = linkify // find hashtags
    .find(post.description)
    .filter((link) => {
      if (link.type === 'hashtag') {
        return link.value.substring(1);
      }
    })
    .map((hashtag) => hashtag.value.substring(1));

  const mentions = linkify // find mentions
    .find(post.description)
    .filter((link) => {
      if (link.type === 'mention') {
        return link.value.substring(1);
      }
    })
    .map((hashtag) => hashtag.value.substring(1));

  const tags = post.tags ? JSON.parse(post.tags).map((tag) => tag.value) : null;

  const uniqueUsernames = tags ? [...new Set([...mentions, ...tags])] : null;
  if (hashtags) post = { ...post, hashtags: [...new Set(hashtags)] };
  if (tags) post = { ...post, tags: JSON.parse(post.tags) };

  post = new Post(post);
  const result = await post.save();
  await new PostLike({ post: result._id }).save();
  return {
    ...result.toObject(),
    author: [{ username: user.username, profilePicture: 'person.png' }],
    likes: 0,
    comments: 0,
  };
};

const getPosts = async ({ initialFetch, lastPostId, user }) => {
  if (initialFetch) {
    query = [
      {
        $facet: {
          posts: [
            {
              $match: {
                author: {
                  $in: user.followings.map((following) =>
                    mongoose.Types.ObjectId(following)
                  ),
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            ...postLookup,

            {
              $project: {
                photo: 1,
                createdAt: 1,
                tags: 1,
                hashtags: 1,
                location: 1,
                likes: {
                  $size: { $arrayElemAt: ['$likes.users_likes', 0] },
                },
                comments: {
                  $size: '$comments',
                },
                description: 1,
                'author._id': 1,
                'author.username': 1,
                'author.profilePicture': 1,
              },
            },
          ],
          total: [
            // Filter out documents without a price e.g., _id: 7
            {
              $match: {
                author: {
                  $in: user.followings.map((following) =>
                    mongoose.Types.ObjectId(following)
                  ),
                },
              },
            },
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
        },
      },
    ];
  } else {
    query = [
      {
        $match: {
          $and: [
            {
              _id: {
                $lt: mongoose.Types.ObjectId(lastPostId),
              },
              author: {
                $in: user.followings.map((following) =>
                  mongoose.Types.ObjectId(following)
                ),
              },
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      ...postLookup,

      {
        $project: {
          photo: 1,
          createdAt: 1,
          tags: 1,
          hashtags: 1,
          location: 1,
          likes: {
            $size: { $arrayElemAt: ['$likes.users_likes', 0] },
          },
          comments: {
            $size: '$comments',
          },
          description: 1,
          'author._id': 1,
          'author.username': 1,
          'author.profilePicture': 1,
        },
      },
    ];
  }
  const result = await Post.aggregate(query);
  if (initialFetch && !result[0].total.length) {
    result[0].total.push({ _id: null, count: 0 }); //if user has no posts
  }
  return result;
};

const getPersonalPosts = async (userId) => {
  const result = await Post.aggregate([
    {
      $match: { author: mongoose.Types.ObjectId(userId) },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    },
    {
      $lookup: {
        from: 'postlikes',
        localField: '_id',
        foreignField: 'post',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'post',
        as: 'comments',
      },
    },
    {
      $project: {
        photo: 1,
        createdAt: 1,
        tags: 1,
        location: 1,
        likes: {
          $size: { $arrayElemAt: ['$likes.users_likes', 0] },
        },
        comments: {
          $size: { $ifNull: ['$comments', []] },
        },
        description: 1,
        'author._id': 1,
        'author.username': 1,
      },
    },
  ]);
  return result;
};

const getAllUserPosts = async (userId) => {
  const result = await Post.aggregate([
    {
      $match: { author: mongoose.Types.ObjectId(userId) },
    },
    { $sort: { createdAt: -1 } },
    ...postLookup,
    {
      $project: {
        photo: 1,
        createdAt: 1,
        tags: 1,
        location: 1,
        likes: {
          $size: { $arrayElemAt: ['$likes.users_likes', 0] },
        },
        comments: {
          $size: { $ifNull: ['$comments', []] },
        },
        description: 1,
        'author._id': 1,
        'author.username': 1,
      },
    },
  ]);
  return result;
};

const removeUserIdFromUserIdList = (array, value) =>
  array.filter((item) => item._id.toString() !== value.toString());

module.exports = {
  createPost,
  getPosts,
  getPersonalPosts,
  getAllUserPosts,
};
