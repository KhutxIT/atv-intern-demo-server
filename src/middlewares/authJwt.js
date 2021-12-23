const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');

const verifyToken = async (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    next(new ApiError(403, 'No token provided!'));
    return;
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      next(new ApiError(401, 'Invalid Token'));
      return;
    }
    req.userId = decoded.id;
    next();
  });
}

const isEmployee = async (req, res, next) => {
  await handlePermission(req, res, next, 'employee');
}

const isAccountant = async (req, res, next) => {
  await handlePermission(req, res, next, 'accountant');
}

const isAdmin = async (req, res, next) => {
  await handlePermission(req, res, next, 'admin');
}

const isManager = async (req, res, next) => {
  await handlePermission(req, res, next, 'manager');
}

const handlePermission = async (req, res, next, roleName) => {
  let user = await userService.getUserByPk(req.userId);
  for (role of user.dataValues.roles) {
    if (role.name === roleName) {
      next();
      return;
    }
  }
  next(new ApiError(403, 'Not Permission!'));
};

module.exports = {
  verifyToken,
  isAccountant,
  isAdmin,
  isEmployee,
  isManager
}

// error nên để cho next, chỉ một file middleware handle errors.