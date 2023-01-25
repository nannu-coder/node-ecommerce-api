const router = require("express").Router();
const {
  authenticateUser,
  authorization,
} = require("../Middleware/Authenticate");
const {
  getAllUsers,
  getSingleUser,
  currentUser,
  updateUser,
  updateUserPassword,
} = require("../Controllers/UserControllers");

router.route("/").get(authenticateUser, authorization("admin"), getAllUsers);
router.route("/showme").get(authenticateUser, currentUser);
router.route("/updateuser").patch(authenticateUser, updateUser);
router.route("/updatepassword").patch(authenticateUser, updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
