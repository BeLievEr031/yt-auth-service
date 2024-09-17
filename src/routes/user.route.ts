/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, NextFunction, Router } from 'express';
import AuthController from '../controllers/AuthController';
import { AuthService } from '../services';
import { userRegisterValidator } from '../validators/auth-validator';
import { UserSignUpRequest } from '../types';
import User from '../models/User';
import QueryService from '../services/QueryService';

const userRouter = Router();
const authService = new AuthService(User);
const queryService = new QueryService(User);
const authController = new AuthController(authService, queryService);

userRouter.post(
  '/register',
  userRegisterValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req as UserSignUpRequest, res, next),
);

export default userRouter;
