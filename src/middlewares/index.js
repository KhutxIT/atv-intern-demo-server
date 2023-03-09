const AuthMiddleware = require('./auth-middleware');
const ErrorHandleMiddleware = require('./error-handle-middleware');
const ErrorLogsMiddleware = require('./error-logs-middleware');
const ResponseHandleMiddleware = require('./response-handle-middleware');
// const ProcessPhoneMiddleware = require('./process-phone-middleware')

module.exports = {
  AuthMiddleware,
  ErrorHandleMiddleware,
  ErrorLogsMiddleware,
  ResponseHandleMiddleware,
  // ProcessPhoneMiddleware,
};
