const authConfig = require('../config/auth.config');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

var jwt = require('jsonwebtoken');


const login = async (emailBody, passwordBody) => {
  let user = await userService.getUserByEmail(emailBody);
  if (!user || user.status === 2) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email not exists!');
  }
  if (passwordBody !== user.password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  var token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 86400
  });

  var authorities = [];
  let roles = await user.getRoles();
  for (let i = 0; i < roles.length; i++) authorities.push(roles[i]);
  user.setDataValue('accessToken', token);
  user.setDataValue('roles', authorities);

  return user;
}

module.exports = {
  login
}