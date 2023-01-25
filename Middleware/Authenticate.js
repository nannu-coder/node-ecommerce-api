const { Unauthorized, forbiddenError } = require("../Errors");
const { isValidToken } = require("../Utils/JWT");

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new Unauthorized("Invalid Authorization");
  }

  try {
    const { name, userId, role } = isValidToken({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new Unauthorized("Invalid authorization");
  }
};

const authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new forbiddenError("User not Authorized for this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorization };
