import { User } from '../models/User.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiErrors.js';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (message) {
    throw new ApiError(
      500,
      "Can't able to generate the refresh and access Token"
    );
  }
};
const registerUser = asyncHandler(async (req, res, _) => {
  const { username, email, password, fullName } = req.body;

  if (![username, email, password, fullName].some(Boolean)) {
    throw new ApiError(400, 'All fields are mandatory!!!');
  }

  const user = await User.findOne({
    $or: ['username', 'email'],
  });

  if (user) {
    return res
      .status(200)
      .json(new ApiResponse(200, 'User Already Exits Please Login!!!', user));
  }

  const createdUser = await User.create({
    email,
    fullName,
    password,
    username,
  });

  const finalCreatedUser = await User.findById(createdUser._id).select(
    '-password -refreshToken'
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, 'User Created Succesfully!!!', finalCreatedUser)
    );
});
const loginUser = asyncHandler(async (req, res, _) => {
  const { username, email, password } = req.body;

  if (![username, email, password].some(Boolean)) {
    throw new ApiError(400, 'All fields are mandatory!!!');
  }

  const user = await User.findOne({
    $or: ['username', 'email'],
  });

  if (!user) {
    throw new ApiError(
      400,
      'User for the particular username or the phone number not Found'
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!password) {
    throw new ApiError(400, 'Incorrect Password please try again!!!');
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(
    user?._id
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cokkies('accessToken', accessToken, options)
    .cokkies('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, 'User logged in successfully!!!', {
        user: loggedInUser,
        refreshToken,
        accessToken,
      })
    );

});

export {registerUser, loginUser}
