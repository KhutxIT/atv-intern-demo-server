class UnauthoriedException extends Error {
  constructor(msg) {
    super(msg);
  }
}

module.exports = UnauthoriedException
