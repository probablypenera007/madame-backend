const errorMessages = require("../utils/errorMessages");

class UnauthorizedError extends Error {
  constructor() {
    super(errorMessages.Unauthorized);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;