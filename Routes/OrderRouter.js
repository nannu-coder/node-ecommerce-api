const router = require("express").Router();
const {
  authenticateUser,
  authorization,
} = require("../Middleware/Authenticate");
const {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
} = require("../Controllers/OrderController");

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorization("admin"), getAllOrder);

router.route("/showmyorders").get(authenticateUser, getCurrentUserOrder);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
