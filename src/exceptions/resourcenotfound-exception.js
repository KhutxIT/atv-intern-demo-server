class ResourceNotFoundException extends Error {
  constructor(msg) {
    super(msg);
  }
}

module.exports = ResourceNotFoundException;
