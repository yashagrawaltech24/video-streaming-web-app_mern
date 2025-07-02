import { model, Schema } from 'mongoose';
import { emailRegex } from '../../utils/regex';
import type { UserDocument } from './user.types';
import { compare, hash } from 'bcrypt';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import env from '../../config/env';

const userSchema = new Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      maxLength: 100,
      minLength: 4,
      match: emailRegex,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
      minLength: 8,
      select: false,
    },
    channels: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Channel',
        },
      ],
      default: [],
    },
    subscriptions: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Subscription',
        },
      ],
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
      select: false,
      index: true,
    },
    otp: {
      type: Number,
      select: false,
      validate: {
        validator: (val: number) => /^\d{6}$/.test(val.toString()),
        message: 'OTP must be 6 digits.',
      },
      set(this: UserDocument, val: number) {
        if (val) {
          this.otpCreatedAt = new Date();
        } else {
          this.otpCreatedAt = undefined;
        }
        return val;
      },
    },
    otpCreatedAt: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

// Operations before saving document
userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }

  next();
});

// Compare provided password with hashed one
userSchema.methods.comparePassword = async function (
  this: UserDocument,
  providedPassword: string,
): Promise<boolean> {
  return compare(providedPassword, this.password);
};

// Generate refresh token and set it on the user
userSchema.methods.generateRefreshToken = function (this: UserDocument) {
  try {
    const payload = { _id: this._id };
    const token = sign(payload, env.Refresh_Token_Secret);
    if (token) {
      this.refreshToken = token;
    }
    return token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error while generating refresh token');
    }
  }
};

// Generate access token
userSchema.methods.generateAccessToken = function (this: UserDocument) {
  try {
    const payload = { _id: this._id };
    const token = sign(payload, env.Access_Token_Secret);
    return token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error while generating access token');
    }
  }
};

// Verify provided refresh token
userSchema.methods.verifyRefreshToken = function (this: UserDocument, token: string) {
  try {
    const payload = verify(token, env.Refresh_Token_Secret);
    if (typeof payload === 'string') throw new Error('Invalid token payload');
    return payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error while verifying refresh token');
    }
  }
};

// Verify provided access token
userSchema.methods.verifyAccessToken = function (this: UserDocument, token: string) {
  try {
    const payload = verify(token, env.Access_Token_Secret);
    if (typeof payload === 'string') throw new Error('Invalid token payload');
    return payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error while verifying access token');
    }
  }
};

// Check if provided OTP is correct and not expired (5 mins)
userSchema.methods.verifyOtp = function (this: UserDocument, providedOtp: number) {
  if (!this.otp || !this.otpCreatedAt) return false;
  if (this.otp !== providedOtp) return false;
  return Date.now() - this.otpCreatedAt.getTime() <= 5 * 60 * 1000;
};

// Clear OTP and its timestamp
userSchema.methods.clearOtp = function (this: UserDocument) {
  this.otp = undefined;
  this.otpCreatedAt = undefined;
};

const User = model<UserDocument>('User', userSchema);
export default User;
