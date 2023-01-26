const { StatusCodes } = require("http-status-codes");
const { BadRequestError, notFoundError, forbiddenError } = require("../Errors");
const Product = require("../Models/ProductModel");

const createOrder = async (req, res) => {
  res.send("create Product");
};

const getAllOrder = async (req, res) => {
  res.send("get All Order");
};
const getSingleOrder = async (req, res) => {
  res.send("get Single Order");
};
const getCurrentUserOrder = async (req, res) => {
  res.send("get Current User Order");
};
const updateOrder = async (req, res) => {
  res.send("Update Order");
};

module.exports = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
};
