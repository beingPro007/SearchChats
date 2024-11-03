import mongoose,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema=new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      trim: true,
      unique: true, // Ensure usernames are unique
      minlength: [3,'Username must be at least 3 characters long'],
      maxlength: [15,'Username cannot exceed 15 characters'],
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true,'Password is required!'],
      minLength: [8,'Password must be at least 8 characters long'],
      maxLength: [20,'Password cannot exceed 20 characters'],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      match: [/.+@.+\..+/,'Please fill a valid email address'],
    },
    resetPasswordToken: {
      type: String,
      required: false,
      unique: true,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
      unique: true,
    }
  },
  {timestamps: true}
);

// Pre-save hook for password hashing
userSchema.pre('save',async function(next) {
  if(!this.isModified('password')) return next();
  this.password=await bcrypt.hash(this.password,10);
  next();
});

// Method to compare passwords
userSchema.methods.isPasswordCorrect=async function(password) {
  return await bcrypt.compare(password,this.password);
};

// Method to generate access tokens
userSchema.methods.generateAccessToken=function() {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY,
      }
    );
  } catch(error) {
    console.error('Error generating acces token',error);
  }
};

// Method to generate refresh tokens
userSchema.methods.generateRefreshToken=function() {
  try {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY,
      }
    );
  } catch(error) {
    console.error('Error generating the refreshToken',error);

  }
};

// Export the User model
export const User=mongoose.model('User',userSchema);
