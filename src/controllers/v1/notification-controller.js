const mongoose = require('mongoose');
const { AppException } = require('../../exceptions');
const { Notification } = require('../../models/v2');

const readNotifications = (req, res, next) => {
  Notification.updateMany(
    { _id: { $in: req.body.notificationIds } },
    { $set: { read: true } },
    { multi: true }
  )
    .then((result) => {
      res.json({
        data: {
          read: 'notifications',
        },
      });
    })
    .catch((err) => {
      console.log(err);
      next(new InvalidResourceException(err.message));
    });
};

const getNotifications = (req, res, next) => {
  let query;

  if (req.query.initialFetch === 'true') {
    query = [
      {
        $facet: {
          notifications: [
            {
              $match: {
                receiver: mongoose.Types.ObjectId(req.user._id),
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: 'sender',
                foreignField: '_id',
                as: 'sender',
              },
            },
            {
              $lookup: {
                from: 'posts',
                localField: 'post',
                foreignField: '_id',
                as: 'post',
              },
            },
            {
              $lookup: {
                from: 'comments',
                localField: 'comment',
                foreignField: '_id',
                as: 'comment',
              },
            },
            {
              $lookup: {
                from: 'replies',
                localField: 'reply',
                foreignField: '_id',
                as: 'reply',
              },
            },
            {
              $project: {
                _id: 1,
                read: 1,
                message: 1,
                type: 1,
                post: 1,
                comment: 1,
                reply: 1,
                createdAt: 1,
                'sender._id': 1,
                'sender.username': 1,
                'sender.profilePicture': 1,
              },
            },
          ],
          total: [
            {
              $match: {
                receiver: mongoose.Types.ObjectId(req.user._id),
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
                $lt: mongoose.Types.ObjectId(req.query.lastId),
              },
              receiver: mongoose.Types.ObjectId(req.user._id),
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'post',
          foreignField: '_id',
          as: 'post',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comment',
          foreignField: '_id',
          as: 'comment',
        },
      },
      {
        $lookup: {
          from: 'replies',
          localField: 'reply',
          foreignField: '_id',
          as: 'reply',
        },
      },
      {
        $project: {
          _id: 1,
          read: 1,
          message: 1,
          type: 1,
          post: 1,
          comment: 1,
          reply: 1,
          createdAt: 1,
          'sender._id': 1,
          'sender.username': 1,
          'sender.profilePicture': 1,
        },
      },
    ];
  }

  Notification.aggregate(query)
    .then((data) => {
      if (req.query.initialFetch === 'true' && !data[0].total?.length) {
        data[0].total.push({ _id: null, count: 0 }); //if user has no posts
      }

      res.json({ data: data });
    })
    .catch((err) => {
      console.log(err.message);
      next(new AppException(err.message));
    });

  /*
  Notification.find(query)
    .populate("sender", "username profilePicture")
    .select("-receiver")
    .sort({ createdAt: -1 })
    .limit(5)
    .then(response => res.status(200).json({ notifications: response }))
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });*/
};

module.exports = {
  readNotifications,
  getNotifications,
};
