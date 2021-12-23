const logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(403).send({ error: 'Something failed!'});
  } else {
    next(err);
  }
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  res.locals.errorMessage = err.message;
  const response = {
    code: statusCode,
    message,
  };

  res.status(statusCode).send(response);
}

module.exports = {
  logErrors,
  clientErrorHandler,
  errorHandler
}