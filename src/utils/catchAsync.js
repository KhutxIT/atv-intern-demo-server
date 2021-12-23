const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
}; // phan nay chua hieu

module.exports = catchAsync;
