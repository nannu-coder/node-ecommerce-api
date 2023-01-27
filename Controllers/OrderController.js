const { StatusCodes } = require("http-status-codes");
const { BadRequestError, notFoundError, forbiddenError } = require("../Errors");
const Product = require("../Models/ProductModel");
const Order = require("../Models/OrderModel");
const checkPermissions = require("../Utils/checkPermissions");
const { response } = require("express");

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = "ranDomSecret";
  return { amount, clientSecret };
};

const createOrder = async (req, res) => {
  const { items, tax, shippingFee } = req.body;

  if (!items || items.length < 1) {
    throw new BadRequestError("No Item Found To Show");
  }

  if (!tax || !shippingFee) {
    throw new BadRequestError("Please Provide tax and shippingFee");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new notFoundError(
        `Product Not Found with this ID: ${item.product}`
      );
    }

    const { name, image, _id, price } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      image,
      product: _id,
      price,
    };

    //Order Items
    orderItems = [...orderItems, singleOrderItem];
    //Subtotal
    subtotal += price * item.amount;
  }

  //Total
  const total = tax + shippingFee + subtotal;

  //Client Secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrder = async (req, res) => {
  const order = await Order.find({});
  res.status(StatusCodes.OK).json({ order, count: order.length });
};
const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new notFoundError(`Product Not Found with this ID: ${item.product}`);
  }

  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrder = async (req, res) => {
  const currentUserOrder = await Order.find({ user: req.user.userId });
  if (!currentUserOrder) {
    throw new notFoundError(`Product Not Found with this ID: ${item.product}`);
  }

  res
    .status(StatusCodes.OK)
    .json({ currentUserOrder, count: currentUserOrder.length });
};
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new notFoundError(`Product Not Found with this ID: ${item.product}`);
  }

  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
};
