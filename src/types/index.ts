import { Types } from 'mongoose';
import { Request } from 'express';
export type UserRole = 'USER' | 'ADMIN' | 'MANAGER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface User {
  email: string;
  name: string;
  password: string;
  devices: number;
  channelName: string;
  lastLogin: Date;
  coverImgUrl: string;
  socialProfileUrl: string[];
  role: UserRole;
  status: UserStatus;
  profilePicture: string;
  subscribers: number;
  subscribedTo: Types.ObjectId[];
  likedVideos: Types.ObjectId[];
  dislikedVideos: Types.ObjectId[];
  watchHistory: Types.ObjectId[];
  playlists: {
    name: string;
    videos: Types.ObjectId[];
  }[];
  notifications: {
    message: string;
    isRead: boolean;
    createdAt: Date;
  }[];
}

export interface UserSignUpRequest extends Request {
  body: User;
}

export interface GlobalError extends Error {
  statusCode: number;
  message: string;
  stackTrace: string;
  success: boolean;
}
