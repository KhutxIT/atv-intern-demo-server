const mongoose = require('mongoose');
const moment = require('moment/moment');
const { VIETNAM_DATE_FORMAT } = require('../common/constant/DateFormat');
const SystemOperation = mongoose.model('SystemOperation');

const updateTotalSignIn = async () => {
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  let item = await SystemOperation.findOne({
    date: {
      $gte: new Date(`${currentDate}T00:00:00.000+07:00`),
      $lt: new Date(`${currentDate}T23:59:59.999+07:00`),
    },
  });
  if (item) {
    await SystemOperation.findOneAndUpdate(
      {
        _id: item._id,
      },
      {
        $set: {
          totalSignIn: (item.totalSignIn || 0) + 1,
        },
      }
    );
  } else {
    item = new SystemOperation({
      totalSignIn: 1,
    });
    await item.save();
  }
};

const updateTotalNewUser = async () => {
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  let item = await SystemOperation.findOne({
    date: {
      $gte: new Date(`${currentDate}T00:00:00.000+07:00`),
      $lt: new Date(`${currentDate}T23:59:59.999+07:00`),
    },
  });
  if (item) {
    await SystemOperation.findOneAndUpdate(
      {
        _id: item._id,
      },
      {
        $set: {
          totalNewUser: (item.totalNewUser || 0) + 1,
        },
      }
    );
  } else {
    item = new SystemOperation({
      totalNewUser: 1,
    });
    await item.save();
  }
};

const updateTotalNewPost = async () => {
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  let item = await SystemOperation.findOne({
    date: {
      $gte: new Date(`${currentDate}T00:00:00.000+07:00`),
      $lt: new Date(`${currentDate}T23:59:59.999+07:00`),
    },
  });
  if (item) {
    await SystemOperation.findOneAndUpdate(
      {
        _id: item._id,
      },
      {
        $set: {
          totalNewPost: (item.totalNewPost || 0) + 1,
        },
      }
    );
  } else {
    item = new SystemOperation({
      totalNewPost: 1,
    });
    await item.save();
  }
};

module.exports = {
  updateTotalSignIn,
  updateTotalNewUser,
  updateTotalNewPost,
};
