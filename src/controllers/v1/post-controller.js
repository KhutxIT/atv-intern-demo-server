const { PostService } = require('../../services/v1');
const catchAsync = require('../../utils/catchasync-util');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const PostLike = mongoose.model('PostLike');
const Notification = mongoose.model('Notification');
const Comment = mongoose.model('Comment');

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

const searchPosts = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { query, limit, offset } = req.query;
  const posts = await PostService.searchPosts(_id, { query, limit, offset });
  res.json({
    data: posts,
  });
});

const countUsers = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { query } = req.query;
  const result = await PostService.countPosts(_id, { query });

  res.json({
    data: result,
  });
});

const getPosts = (req, res) => {
  let query;
  const user = req.user;

  if (req.body.initialFetch) {
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
                $lt: mongoose.Types.ObjectId(req.body.lastId),
              },
              author: { $in: req.body.followings },
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

  Post.aggregate(query)
    .then((data) => {
      if (req.body.initialFetch && !data[0].total.length) {
        data[0].total.push({ _id: null, count: 0 }); //if user has no posts
      }

      res.status(200).json({ data });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

const getPost = (req, res) => {
  Post.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.body.postId) } },
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
          $size: '$comments',
        },
        description: 1,
        'author._id': 1,
        'author.username': 1,
        'author.profilePicture': 1,
        'author.name': 1,
      },
    },
  ])
    .then((post) => {
      if (!post.length) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.status(200).json({ post });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

const deletePost = (req, res) => {
  Post.findOneAndDelete({ _id: req.body.postId, author: req.user._id })
    .then((post) => {
      if (!post) return res.status(401).json({ message: 'Failed to delete' });

      Comment.deleteMany({
        post: mongoose.Types.ObjectId(post._id),
      }).then((docs) => console.log(docs));
      PostLike.findOneAndDelete({
        post: mongoose.Types.ObjectId(post._id),
      }).then(() => console.log('deleted post likes'));
      Notification.deleteMany({
        post: mongoose.Types.ObjectId(post._id),
      }).then(() => console.log('deleted notifications'));

      res.status(200).json({ message: 'Deleted', id: post._id });
    })
    .catch((err) => res.status(400).json({ message: err.message }));
};

const likePost = catchAsync(async (req, res) => {
  const document = await PostLike.updateOne(
    {
      post: req.body.postId,
      'users_likes.author': { $ne: req.user._id },
    },
    {
      $addToSet: { users_likes: { author: req.user._id } },
    }
  );
  if (document.nModified === 1) {
    let notification;
    if (req.user._id !== req.body.authorId) {
      notification = await new Notification({
        sender: req.user._id,
        receiver: req.body.authorId,
        type: 'like_post',
        post: req.body.postId,
      }).save();
      await notification.populate('post', 'photo').execPopulate();
    }

    const user = await User.updateOne(
      { _id: req.user._id },
      { $push: { postLikes: { post: req.body.postId } } },
      { new: true, upsert: true }
    );

    res.json({ postId: req.body.postId, action: 'liked' });

    // Promise.all([user, notification])
    //   .then((values) => {
    //     notificationHandler.sendLikePostNotification(req, values);
    //     return res
    //       .status(200)
    //       .json({ postId: req.body.postId, action: 'liked' });
    //   })
    //   .catch((err) => console.log(err));
  } else {
    const postLike = await PostLike.updateOne(
      { post: req.body.postId },
      {
        $pull: { users_likes: { author: req.user._id } },
      },
      { new: true, upsert: true }
    );

    const user = await User.updateOne(
      { _id: req.user._id },
      { $pull: { postLikes: { post: req.body.postId } } },
      { new: true, upsert: true }
    );

    res.json({ postId: req.body.postId, action: 'disliked' });

    // Promise.all([postLike, user])
    //   .then((values) => {
    //     return res
    //       .status(200)
    //       .json({ postId: req.body.postId, action: 'disliked' });
    //   })
    //   .catch((err) => console.log(err));
  }
});

const getPostLikes = (req, res) => {
  PostLike.find({ post: req.body.postId })
    .populate('users_likes.author', 'username profilePicture')
    .then((users) => {
      res.status(200).json({ users });
    });
};

module.exports = {
  searchPosts,
  countUsers,
  getPost,
  getPostLikes,
  getPosts,
  likePost,
  deletePost,
};
