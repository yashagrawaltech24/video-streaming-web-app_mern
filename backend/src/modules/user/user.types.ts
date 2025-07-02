import type { JwtPayload } from 'jsonwebtoken';
import type { Document, ObjectId } from 'mongoose';

// Base structure of a User
export interface UserType {
  fullName: string;
  email: string;
  password: string;
  refreshToken: string;
  subscriptions?: ObjectId[];
  otp?: number;
  channels?: ObjectId[];
  otpCreatedAt?: Date;
}

// Extended user document with custom methods
export interface UserDocument extends Document, UserType {
  comparePassword(providedPassword: string): Promise<boolean>;
  generateRefreshToken(): string;
  generateAccessToken(): string;
  verifyRefreshToken(token: string): JwtPayload;
  verifyAccessToken(token: string): JwtPayload;
  verifyOtp(providedPassword: number): boolean;
  clearOtp(): void;
}
