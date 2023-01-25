const { forbiddenError } = require("../Errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new forbiddenError("User dose not authorized to access this resource");
};

module.exports = checkPermissions;
