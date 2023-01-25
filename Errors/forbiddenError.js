const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./customAPIError");

class forbiddenError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = forbiddenError;
