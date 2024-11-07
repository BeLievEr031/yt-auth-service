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
  role: string;
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
  imageSrc: string;
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

export interface Bid {
  amount: number;
  problemId: Types.ObjectId;
  workerId: Types.ObjectId;
  status?: boolean;
}

export interface PlaceBidRequest extends Request {
  body: Bid;
  auth: Authenticate;
}

export interface UpdateBidRequest extends Request {
  params: { bidId: string };
  body: Bid;
  auth: Authenticate;
}

export interface DeleteBidRequest extends Request {
  params: { bidId: string };
  auth: Authenticate;
}

export interface BidPaginationQuery {
  page: string;
  limit: string;
  sort: string;
}

export interface FetchBidRequest extends Request {
  query: {
    page: string;
    limit: string;
    sort: string;
    sortBy: 'workerid' | 'problemid';
    problemId?: string;
  };
  auth: Authenticate;
}

export interface FetchBidByProblemIdRequest extends Request {
  query: {
    page: string;
    limit: string;
    sort: string;
  };
  params: {
    id: string;
  };
  auth: Authenticate;
}

export interface FetchManyProblemRequest extends Request {
  auth: Authenticate;
  query: {
    page: string;
    limit: string;
    sort: 'asc' | 'desc';
  };
}

export interface fetchOneProblemRequest extends Request {
  params: {
    id: string;
  };
  auth: Authenticate;
}

export interface FetchWorkersRequest extends Request {
  query: {
    page: string;
    limit: string;
    sort: string;
    sortBy?: 'initialPrice' | 'expertiseIN';
    expertise?: string;
  };
  auth: Authenticate;
}

export interface FetchWorkerBidsRequest extends Request {
  query: {
    page: string;
    limit: string;
    sort: string;
    sortBy?: 'initialPrice' | 'expertiseIN';
    expertise?: string;
  };
  auth: Authenticate;
}

export interface CheckForBidPlacedOrNotRequest extends Request {
  params: {
    id: string;
  };
  auth: Authenticate;
}

export interface AcceptBidRequest extends Request {
  params: {
    id: string;
  };
  body: {
    problemId: string;
  };
  auth: Authenticate;
}

export interface BecomeWorkerRequest extends Request {
  body: {
    initialPrice: number;
  };
  auth: Authenticate;
}

export interface TransporterObj {
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_HOST_USER: string;
  MAIL_HOST_PASS: string;
}
