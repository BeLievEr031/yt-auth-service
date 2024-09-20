import { Request } from 'express';
import { Types } from 'mongoose';
export type UserRole = 'USER' | 'ADMIN' | 'MANAGER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface User {
  _id?: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  devices: number;
}

export interface UserSignUpRequest extends Request {
  body: User;
}

export interface UserSignInRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface GlobalError extends Error {
  statusCode: number;
  message: string;
  stackTrace: string;
  success: boolean;
}

export interface AuthCookie {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticateReq extends Request {
  auth: {
    id: string;
    email: string;
  };
}

export interface IRefreshTokenPayload {
  sub: string | Types.ObjectId;
  id: string;
}
