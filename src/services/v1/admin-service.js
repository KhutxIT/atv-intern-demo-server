const moment = require('moment/moment');
const { ACCOUNT_STATUS } = require('../../common/bundle-enums');
const { InvalidResourceException, AppException } = require('../../exceptions');
const { User, SystemOperation, Post, NFT } = require('../../models/v2');
const {
  getLastMonthEnglishFormat,
  getLastMonthMiddleDate,
} = require('../../utils/date');

const changeAccountStatus = async (_id, status) => {
  if (status !== ACCOUNT_STATUS.ACTIVE && status !== ACCOUNT_STATUS.LOCK) {
    throw new InvalidResourceException('status không hợp lệ');
  }
  let user = await User.findOne({ _id });
  if (!user) throw new InvalidResourceException('Tài khoản không tồn tại!');

  const result = await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        accountStatus: status,
      },
    },
    { new: true }
  );

  if (!result) {
    throw new AppException('Update profile failed');
  }

  return result;
};

const countTotalActiveUser = async () => {
  return await User.countDocuments({ isOnline: true }).exec();
};

const countTotalNewUserInThisMonth = async () => {
  const currentMonth = moment(new Date()).format('YYYY-MM');
  return await User.countDocuments({
    date: {
      $gte: new Date(`${currentMonth}-01T00:00:00Z`),
      $lt: new Date(),
    },
  }).exec();
};

const countTotalSignInInThisMonth = async () => {
  const currentMonth = moment(new Date()).format('YYYY-MM');
  const items = await SystemOperation.find({
    date: {
      $gte: new Date(`${currentMonth}-01T00:00:00Z`),
      $lt: new Date(),
    },
  });
  let result = 0;
  if (items) {
    items.forEach((item) => (result += item.totalSignIn));
  }
  return result;
};

const getDateStats = async () => {
  const lastMonthFirstDate = getLastMonthMiddleDate();
  const items = await SystemOperation.find({
    date: {
      $gte: new Date(`${lastMonthFirstDate}T00:00:00Z`),
      $lt: new Date(),
    },
  });
  return items;
};

const countTotalNewPostInThisMonth = async () => {
  const currentMonth = moment(new Date()).format('YYYY-MM');
  return await Post.countDocuments({
    createdAt: {
      $gte: new Date(`${currentMonth}-01T00:00:00Z`),
      $lt: new Date(),
    },
  }).exec();
};

const createNFT = async (data) => {
  let nft = await NFT.findOne({ name: data.name });
  if (nft) throw new InvalidResourceException('Tên nft đã được sử dụng');

  nft = new NFT(data);
  const result = await nft.save();

  // Remove unecessary fields and return result
  if (result) {
    const account = result.toObject();

    return account;
  }

  throw new AppException('Something went wrong!');
};

const fetchNFTs = async ({ query, limit, offset }) => {
  offset = offset ? Number.parseInt(offset) : 0;
  limit = limit ? Number.parseInt(limit) : 10;

  if (query) {
    return await NFT.find({
      $or: [
        { name: new RegExp('^' + query, 'i') },
        { description: new RegExp('^' + query, 'i') },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
  }

  return await NFT.find().sort({ createdAt: -1 }).limit(limit).skip(offset);
};

module.exports = {
  changeAccountStatus,
  countTotalActiveUser,
  countTotalNewUserInThisMonth,
  countTotalNewPostInThisMonth,
  countTotalSignInInThisMonth,
  getDateStats,
  createNFT,
  fetchNFTs,
};
