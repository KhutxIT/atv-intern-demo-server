const {
  InvalidResourceException,
  UnauthoriedException,
  ForbiddenException,
} = require('../exceptions');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/v2');
const catchAsync = require('../utils/catchasync-util');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      next(new UnauthoriedException('Invalid token'));
      return null;
    }

    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.tokenSecret);

    if (!(decoded || decoded._id)) {
      next(new UnauthoriedException('Invalid token'));
      return null;
    }

    const user = await User.findOne({ _id: decoded._id });
    if (!user || !user._id) {
      next(new UnauthoriedException('Invalid token'));
      return null;
    }

    return user.toObject();
  } catch (err) {
    next(new UnauthoriedException('Invalid token'));
    return null;
  }
};

const verifyUser = async (req, res, next) => {
  const user = await verifyToken(req, res, next);
  if (user?.role === 'USER' || user?.role === 'ADMIN') {
    req.user = user;
    next();
  } else next(new ForbiddenException('Forbidden'));
};

const verifyAdmin = async (req, res, next) => {
  const user = await verifyToken(req, res, next);
  if (user?.role !== 'ADMIN') next(new ForbiddenException('Forbidden'));
  req.user = user;
  next();
};

module.exports = {
  verifyUser,
  verifyAdmin,
};
