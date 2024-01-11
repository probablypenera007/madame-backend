const errorMessages = require("../utils/errorMessages");

class ForbiddenError extends Error {
  constructor() {
    super(errorMessages.Forbidden);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;