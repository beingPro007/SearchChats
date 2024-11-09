import {User} from '../models/User.models.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiErrors.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer'

const generateAccessAndRefreshToken=async (userId) => {
  try {
    const user=await User.findById(userId);
    if(!user) {
      throw new ApiError(404,'User not found');
    }

    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    if(!accessToken||!refreshToken) {
      res.status(501).json(new ApiResponse(501,"Error in generating access and refresh token!!!"))
    }

    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave: false});
    return {accessToken,refreshToken};
  } catch(error) {
    console.error('Token generation error:',error);
    throw new ApiError(
      500,
      'Failed to generate the access and refresh tokens.'
    );
  }
};

const registerUser=asyncHandler(async (req,res,_) => {
  const {username,email,password,fullName}=req.body;

  console.log({username,email,fullName,password});

  // Check if all fields are provided
  if(
    [username,email,password,fullName].some((field) => field?.trim()==='')
  ) {
    throw new ApiError(400,'All fields are mandatory!');
  }

  // Check if a user with the same username or email already exists
  const user=await User.findOne({
    $or: [{username},{email}],
  });

  console.log('I am here');

  if(user) {
    return res
      .status(200)
      .json(new ApiResponse(200,'User already exists, please login!',user));
  }

  const createdUser=await User.create({
    email,
    fullName,
    password,
    username,
  });

  // Retrieve the user without password and refreshToken fields
  const finalCreatedUser=await User.findById(createdUser._id).select(
    '-password -refreshToken'
  );

  return res
    .status(201)
    .json(new ApiResponse(201,'User created successfully!',finalCreatedUser));
});

const loginUser=asyncHandler(async (req,res,next) => {
  console.log('Login request received:',req.body);
  const {username,email,password}=req.body;

  // Check if either username or email and password are provided
  if((!username&&!email)||!password) {
    return res
      .status(400)
      .json(new ApiResponse(400,'Email/Username and Password are required.'));
  }

  // Find user by email or username
  const user=await User.findOne({
    $or: [{username},{email}],
  });
  if(!user) {
    console.log('User not found');
    return res.status(400).json(new ApiResponse(400,'User not found!'));
  }

  // Validate password
  const isPasswordValid=await user.isPasswordCorrect(password);
  if(!isPasswordValid) {
    console.log('Incorrect password');
    return res.status(400).json(new ApiResponse(400,'Incorrect password!'));
  }

  // Generate tokens if credentials are correct
  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

  const loggedInUser=await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // Set cookie options
  const options={
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7*24*60*60*1000,
    path: '/',
  };

  return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(
      new ApiResponse(200,'User logged in successfully!',{
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser=asyncHandler(async (req,res) => {
  const user=req.body;
  console.log(req.body);

  try {
    if(!user) {
      throw new ApiError(400,"You need to login to use the logout feature")
    }

    const userId=user?._id;

    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {refreshToken: undefined}
      },
      {
        new: true,
      }
    )

    const options={
      httpOnly: true,
      secure: true,
    }
    return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(200,{},"User Logged out"));
  } catch(error) {
    console.log(error);
  }

})
const forgotPassword=asyncHandler(async (req,res) => {
  const email=req.body.email

  if(!email) {
    throw new ApiError(400,"Email is required!!!");
  }

  const user=await User.findOne({email: email});

  if(!user) {
    return res.status(400,new ApiResponse(400,"User not exists, use another email!!!"));
  }

  const token=crypto.randomBytes(32).toString('hex');

  try {
    if(!token) {
      return res.status(400,new ApiResponse(400,"Token generation failed!!!"));
    }

    user.resetPasswordToken=token;
    user.resetPasswordExpires=Date.now()+3600000;

    await user.save({validateBeforeSave: false});

    const transporter=nodemailer.createTransport({
      service: 'gmail', // or any other email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink=`https://authenticationsfinal.vercel.app/reset-password?token=${token}`;

    const mailOptions={
      to: user.email,
      subject: 'Password Reset Request for Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Password Reset Request</h2>
          <p>Hi ${user.name||''},</p>
          <p>We received a request to reset the password associated with this email address. If you made this request, please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button above doesn’t work, you can also copy and paste this link into your browser:</p>
          <p><a href="${resetLink}" style="color: #4CAF50;">${resetLink}</a></p>
          <p>If you didn’t request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>Best regards,</p>
          <p>The Search Chat Team</p>
          <hr>
          <small style="color: #888;">If you have any questions, please contact our support team at support@yourcompany.com</small>
        </div>
      `
    };


    const transported=await transporter.sendMail(mailOptions);

    if(!transported) {
      throw new ApiError(400,'Transportation Unsuccessful!!!');
    }

    console.log(transported);

    return res.status(200).json({status: 200,message: "Password reset link sent successfully!"});
  } catch(error) {
    console.log("Something went wrong!!!",error);
    throw new ApiError(500,"Internal Server Error");
  }
});

const resetPassword=asyncHandler(async (req,res) => {
  const token=req.body.token;
  console.log(token);

  const newPassword=req.body.newPassword;

  const user=await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: {$gt: Date.now()}
  });

  console.log(user);

  if(!user) {
    return res.status(400).json({message: 'Invalid or expired token'});
  }

  user.password=newPassword; // Ensure password hashing happens here
  user.resetPasswordToken=undefined;
  user.resetPasswordExpires=undefined;

  await user.save({validateBeforeSave: false});

  return res.status(200).json({status: 200,message: "Password changed successfully!!!"});
});

export {registerUser,loginUser,logoutUser,forgotPassword,resetPassword};
