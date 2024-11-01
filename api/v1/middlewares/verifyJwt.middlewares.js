import { User } from '../models/User.models.js';
import { ApiError } from '../utils/ApiErrors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '').trim();

  if (!token) {
    throw new ApiError(400, 'Invalid Token or no Token found. Please log in.');
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

  if (!decodedToken) {
    throw new ApiError(400, 'Token validation failed.');
  }

  const user = await User.findById(decodedToken._id).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(400, 'User not found.');
  }
  req.user = user;
  // Send the user data back as JSON
  return res.status(200).json({ message: "Token verified successfully", user });
});
