const errorMessages = require("../utils/errorMessages");

class BadRequestError extends Error {
  constructor() {
    super(errorMessages.BadRequest);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;