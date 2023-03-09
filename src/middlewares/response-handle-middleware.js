const { AppException } = require('../exceptions');

const ResponseHandleMiddleware = (req, res, next) => {
  // if (err) return next(err)

  const { data, message } = req;

  if (data || message) {
    return res.json({
      data,
      message,
    });
  }

  next(new AppException('Data and message are null'));
};

module.exports = ResponseHandleMiddleware;
