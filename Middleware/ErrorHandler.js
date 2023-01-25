const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  if (err && err.code === 11000) {
    defaultError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )}  field`;
    defaultError.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");

    defaultError.code = 400;
  }

  if (err.name === "CastError") {
    defaultError.msg = `No Item found with ID: ${err.value}`;
  }

  return res.status(defaultError.statusCode).json(defaultError.msg);
};

module.exports = errorHandler;
