const errorMessages = require("../utils/errorMessages");

class ForbiddenError extends Error {
  constructor() {
    super(errorMessages.ForbiddenMessag);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;