const { FriendRequestService } = require('../../services/v1');
const catchAsync = require('../../utils/catchasync-util');

const getFriendRequestSentList = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await FriendRequestService.getFriendRequestSentList(_id);

  res.json({
    data: result,
  });
});

module.exports = {
  getFriendRequestSentList,
};
