const { AdminService } = require('../../services/v1');
const catchAsync = require('../../utils/catchasync-util');

const changeAccountStatus = catchAsync(async (req, res) => {
  const { _id, status } = req.body;
  const result = await AdminService.changeAccountStatus(_id, status);

  res.json({
    data: result,
  });
});

const getGeneralSystemStats = catchAsync(async (req, res) => {
  const totalActiveUser = await AdminService.countTotalActiveUser();
  const totalNewUserInThisMonth =
    await AdminService.countTotalNewUserInThisMonth();
  const totalSignInInThisMonth =
    await AdminService.countTotalSignInInThisMonth();
  const totalNewPostInThisMonth =
    await AdminService.countTotalNewPostInThisMonth();
  res.json({
    data: {
      totalActiveUser,
      totalNewUserInThisMonth,
      totalSignInInThisMonth,
      totalNewPostInThisMonth,
    },
  });
});

const getDateStats = catchAsync(async (req, res) => {
  const result = await AdminService.getDateStats();
  res.json({
    data: result,
  });
});

const createNFT = catchAsync(async (req, res) => {
  const result = await AdminService.createNFT(req.body);
  res.json({
    data: result,
  });
});

const searchNFT = catchAsync(async (req, res) => {
  const { query, limit, offset } = req.query;
  const result = await AdminService.fetchNFTs({ query, limit, offset });
  res.json({
    data: result,
  });
});

module.exports = {
  changeAccountStatus,
  getGeneralSystemStats,
  getDateStats,
  createNFT,
  searchNFT,
};
