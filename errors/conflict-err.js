const errorMessages = require("../utils/errorMessages");

class ConflictError extends Error {
  constructor() {
    super(errorMessages.Conflict);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;