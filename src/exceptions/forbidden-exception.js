class ForbiddenException extends Error {
  constructor(msg) {
    super(msg);
  }
}

module.exports = ForbiddenException;
