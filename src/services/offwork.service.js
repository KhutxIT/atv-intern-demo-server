const { models } = require('../models');
const { QueryTypes } = require('sequelize');
const sequelize = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createOffwork = async (offworkBody) => {
  await models.offwork.create(offworkBody);
};

const getOffWorkByMonthAndYear = async (userId, month, year) => {
  return await sequelize.query(
    "select * from offworks where userId = ? and month(date) = ? and year(date) = ?",
    {
      replacements: [userId, month, year],
      type: QueryTypes.SELECT
    }
  );
};

const getAllOffWork = async (userId) => {
  return await models.offwork.findAll({
    where: {
      userId: userId
    },
    raw: true
  });
};

const updateOffworkStatus = async (offworkId, status) => {
  let offwork = await models.offwork.findByPk(offworkId);
  if (!offwork)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offwork not exist!');

  await models.offwork.update({ status: status }, {
    where: {
      id: offworkId
    }
  }
  );
};

module.exports = {
  createOffwork,
  getOffWorkByMonthAndYear,
  getAllOffWork,
  updateOffworkStatus
}