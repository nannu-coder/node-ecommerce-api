const { StatusCodes } = require("http-status-codes");
const Product = require("../Models/ProductModel");
const { notFoundError } = require("../Errors");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);

  res.status(StatusCodes.OK).json(product);
};
const getAllProducts = async (req, res) => {
  const product = await Product.find({});
  res.status(StatusCodes.OK).json({ product, count: product.length });
};
const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new notFoundError("Product not found");
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new notFoundError("Product not found");
  }

  res.status(StatusCodes.OK).json(product);
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new notFoundError("Product not found");
  }

  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "Product Deleted" });
};
const uploadImage = async (req, res) => {
  res.send("upload product image");
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
