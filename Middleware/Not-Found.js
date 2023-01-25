const { StatusCodes } = require("http-status-codes");
const notFound = (_, res) =>
  res.status(StatusCodes.NOT_FOUND).send("Page Not Found");

module.exports = notFound;
