const { offworkService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const createOffwork = catchAsync(async (req, res) => {
  req.body.userId = req.userId;
  await offworkService.createOffwork(req.body);
  res.status(httpStatus.CREATED).send({ message: 'Successfully!' });
});

const deleteFormById = catchAsync(async (req, res) => {
  await offworkService.deleteFormById(req.query.formId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getOffWorkByMonthAndYear = catchAsync(async (req, res) => {
  let offworks = await offworkService.getOffWorkByMonthAndYear(
    req.userId, req.query.month, req.query.year
  );
  res.status(httpStatus.OK).send(offworks);
});

const getAllOffWork = catchAsync(async (req, res) => {
  let offworks = await offworkService.getAllOffWork(req.userId);
  res.status(httpStatus.OK).send(offworks);
})

module.exports = {
  createOffwork,
  deleteFormById,
  getOffWorkByMonthAndYear,
  getAllOffWork
}