class InvalidRequestException extends Error {
  constructor(msg) {
    const exceptionMsg = msg || 'Invalid Request URL!';
    super(exceptionMsg);
  }
}

module.exports = InvalidRequestException;
