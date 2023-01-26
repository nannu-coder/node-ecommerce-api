const Review = require("../Models/ReviewSchema");
const { BadRequestError, notFoundError } = require("../Errors");
const Product = require("../Models/ProductModel");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../Utils/checkPermissions");

const createReview = async (req, res) => {
  req.body.user = req.user.userId;
  const { product } = req.body;

  const reviewProduct = await Product.findOne({ _id: product });

  if (!reviewProduct) {
    throw new notFoundError(`Product not found with this id: ${product}`);
  }

  const allReadyReviewd = await Review.findOne({
    product,
    user: req.user.userId,
  });

  if (allReadyReviewd) {
    throw new BadRequestError("All Ready Review for this item");
  }

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "user",
      select: "name role",
    })
    .populate({ path: "product", select: "name" });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });

  if (!review) {
    throw new notFoundError(`Product not found with this id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id } = req.params;
  const { title, comment, rating } = req.body;

  const review = await Review.findOne({ _id: id });

  if (!review) {
    throw new notFoundError(`Product not found with this id: ${id}`);
  }

  checkPermissions(req.user, review.user);

  review.title = title;
  review.comment = comment;
  review.rating = rating;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });

  if (!review) {
    throw new notFoundError(`Product not found with this id: ${id}`);
  }

  checkPermissions(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: "review deleted" });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
