const router = require("express").Router();
const { authenticateUser } = require("../Middleware/Authenticate");
const {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
} = require("../Controllers/OrderController");
