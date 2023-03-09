class InvalidResourceException extends Error {
  constructor(msg) {
    super(msg);
  }
}

module.exports = InvalidResourceException;
