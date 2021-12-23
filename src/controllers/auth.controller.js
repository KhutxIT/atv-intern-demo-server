const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const login = catchAsync(async (req, res) => {
  let user = await authService.login(req.body.email, req.body.password);
  res.status(200).send(user);
});

module.exports = {
  login
}