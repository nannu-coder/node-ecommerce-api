const User = require("../Models/UserModel");
const { BadRequestError, Unauthorized, notFoundError } = require("../Errors");
const { StatusCodes } = require("http-status-codes");
const { attatchCookiesResponse } = require("../Utils/JWT");
const createTokenUser = require("../Utils/CreateTokenUser");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }

  //first user should be admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ email, name, password, role });
  const tokenUser = createTokenUser(user);

  attatchCookiesResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please enter email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Unauthorized("Invalid Credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new Unauthorized("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attatchCookiesResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User Logged Out" });
};

module.exports = {
  register,
  login,
  logout,
};
