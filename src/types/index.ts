import { Request } from 'express';
export type UserRole = 'USER' | 'ADMIN' | 'MANAGER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface User {
  email: string;
  name: string;
  password: string;
  devices: number;
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
