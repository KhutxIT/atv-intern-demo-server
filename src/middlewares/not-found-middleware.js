const notFoundMiddleware = (err, req, res, next) => {
  console.log(err);
  next(err);
};

module.exports = notFoundMiddleware;
