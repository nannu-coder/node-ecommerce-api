const { StatusCodes } = require("http-status-codes");
const Product = require("../Models/ProductModel");
const { notFoundError, BadRequestError } = require("../Errors");
const path = require("path");
const { response } = require("express");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);

  res.status(StatusCodes.OK).json(product);
};
const getAllProducts = async (req, res) => {
  const product = await Product.find({}).populate({
    path: "user",
    select: "name",
  });
  res.status(StatusCodes.OK).json({ product, count: product.length });
};
const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id }).populate("review");
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
  const { image } = req.files;

  if (!image.mimetype.startsWith("image")) {
    throw new BadRequestError("Please Upload an Image file");
  }

  const maxSize = 1024 * 1024;

  if (image.size > maxSize) {
    throw new BadRequestError("Image size must be lower than 5mb");
  }

  const filePath = path.join(__dirname, "../public/uploads/" + image.name);

  image.mv(filePath);

  res
    .status(StatusCodes.OK)
    .json({ msg: "Image Uploaded", src: `/uploads/${image.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
