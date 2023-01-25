const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./customAPIError");

class Unauthorized extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
