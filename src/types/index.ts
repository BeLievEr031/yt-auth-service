// import { Request } from 'express';
import { Request } from 'express-jwt';
import { Types } from 'mongoose';
export type UserRole = 'USER' | 'ADMIN' | 'MANAGER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface User {
  _id?: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  phone: string;
  pincode: string;
  initialPrice: number;
  expertiseIN: string[];
  role: 'admin' | 'worker' | 'user';
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

export interface Authenticate {
  id: string;
  email: string;
  sub?: string;
}

export interface AuthenticateReq extends Request {
  auth: Authenticate;
}

export interface IRefreshTokenPayload {
  sub: string | Types.ObjectId;
  id: string;
}

export interface ChangePasswordRequest extends Request {
  body: {
    oldPassword: string;
    newPassword: string;
  };
}

export interface ForgetPassword extends Request {
  body: {
    email: string;
  };
}

export interface Problem {
  creatorId?: Types.ObjectId;
  workerId?: Types.ObjectId;
  status?: 'unassigned' | 'pending' | 'completed' | 'closed';
  bidId?: Types.ObjectId;
  title: string;
  description: string;
  tag: string;
}

export interface PostProblemRequest extends Request {
  body: Problem;
}

export interface EditProblemRequest extends Request {
  body: Problem;
  auth: Authenticate;
}

export interface UpdateProblemQuery {
  status: string;
  workerId: string;
}

export interface UpdateProblemStatusWorkerRequest extends Request {
  query: {
    status: string;
    workerId: string;
  };
  auth: Authenticate;
}

export interface deleteProblemRequest extends Request {
  id: string;
  auth: Authenticate;
}

export interface Bid extends Document {
  amount: number;
  problemId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface BidRequest extends Request {
  body: Bid;
}

export interface fetchOneProblemRequest extends Request {
  params: {
    id: string;
  };
  auth: Authenticate;
}
export interface TransporterObj {
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_HOST_USER: string;
  MAIL_HOST_PASS: string;
}
