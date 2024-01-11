const errorMessages = require("../utils/errorMessages");

class NotFoundError extends Error {
  constructor() {
    super(errorMessages.NotFound);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;