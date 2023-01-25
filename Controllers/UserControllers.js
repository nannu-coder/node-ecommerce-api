const User = require("../Models/UserModel");
const { StatusCodes } = require("http-status-codes");
const { notFoundError, BadRequestError, Unauthorized } = require("../Errors");
const createTokenUser = require("../Utils/CreateTokenUser");
const { attatchCookiesResponse } = require("../Utils/JWT");
const checkPermissions = require("../Utils/checkPermissions");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");

  if (!user) {
    throw new notFoundError(`No user found for id: ${id}`);
  }

  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const currentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");
  res.status(StatusCodes.OK).json({ user });
};
const updateUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new BadRequestError("Provide email and Name");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);
  attatchCookiesResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please Provide both valuse");
  }

  const user = await User.findOne({ _id: req.user.userId });

  const passwordMatch = await user.comparePassword(oldPassword);

  if (!passwordMatch) {
    throw new Unauthorized("Invalid credentials");
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password changed successfully" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  currentUser,
  updateUser,
  updateUserPassword,
};
