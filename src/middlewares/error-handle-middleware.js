const {
  ValidateException,
  AppException,
  InvalidResourceException,
  ResourceNotFoundException,
  UnauthoriedException,
  ForbiddenException,
  InvalidRequestException,
} = require('../exceptions');

const ErrorHandleMiddleware = (err, req, res, next) => {
  const response = {
    message: err.message,
    data: null,
  };
  let code = 500;

  if (
    err instanceof ValidateException ||
    err instanceof InvalidResourceException
  ) {
    code = 400;
  } else if (
    err instanceof ResourceNotFoundException ||
    err instanceof InvalidRequestException
  ) {
    code = 404;
  } else if (err instanceof UnauthoriedException) {
    code = 401;
  } else if (err instanceof ForbiddenException) {
    code = 403;
  } else if (err instanceof AppException) {
    code = 500;
  }

  return res.status(code).json(response);
};

module.exports = ErrorHandleMiddleware;
