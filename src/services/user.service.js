const { models } = require('../models');
const { Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  if (await getUserByEmail(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST,
      'Email already exists!');
  }
  if (await getUserByCMND(userBody.cmnd_number)) {
    throw new ApiError(httpStatus.BAD_REQUEST,
      'CNMD Number already exists! Please try again!');
  }

  let roles = userBody.roles;
  delete userBody.roles;
  let realRoles = [];
  if (roles) {
    realRoles = await models.role.findAll({
      where: {
        name: {
          [Op.or]: roles
        }
      }
    });
  }
  if (realRoles.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST,
      'All roles you provided is invalid or roles are not exist in DB. Please try again!');
  }
  let user = await models.user.create(userBody);
  user.setRoles(realRoles);
  user.setRoles([1]);
};

const getUserByEmail = async (emailBody) => {
  let user = await models.user.findOne({
    where: {
      email: emailBody
    }
  });

  return user;
};

const getUserByPk = async (userId) => {
  let user = await models.user.findByPk(userId);
  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not exists!');
  await addRoles(user);

  return user;
};

const getUserByCMND = async (cmndNumber) => {
  let user = await models.user.findOne({
    where: {
      cmnd_number: cmndNumber
    }
  });

  return user;
};

const getAll = async () => {
  let users = await models.user.findAll({
      where: {
        status: 1
      }
    }, {
      include: models.role
    }
  );

  return users;
};

const updateUserById = async (userId, userBody) => {
  if (!await models.user.findByPk(userId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Exist User!');
  
  await models.user.update(userBody, {
    where: {
      id: userId
    }
  });
};

const updateUserStatus = async (userId, status) => {
  if (!await models.user.findByPk(userId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not exists!');
  
  await models.user.update({ status: status }, {
    where: {
      id: userId
    }
  });
};

const delUserByPK = async (userId) => {
  if (!await models.user.findByPk(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not exists!');
  }
  models.user.destroy({
    where: {
      id: userId
    }
  });
};

const addRoles = async (user) => {
  let roles = await user.getRoles({ raw: true });
  user.setDataValue('roles', roles);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByPk,
  getAll,
  updateUserById,
  updateUserStatus,
  delUserByPK
}

// co the khong can convert sang JSON, vi khi dung send, co the express tu nhan dien duoc
// data trong object tra ve cua sequelize(dataValues property).