class ValidateException extends Error {
  constructor(msg) {
    const exceptionMsg = (msg || 'Some data') + ' is invalid';
    super(exceptionMsg);
  }
}

module.exports = ValidateException;
