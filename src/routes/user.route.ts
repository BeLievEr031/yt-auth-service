/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, NextFunction, Router } from 'express';
import AuthController from '../controllers/AuthController';
import { AuthService } from '../services';
import { userRegisterValidator } from '../validators/auth-validator';
import { UserSignUpRequest } from '../types';

const userRouter = Router();
const authService = new AuthService();
const authController = new AuthController(authService);
userRouter.post(
  '/register',
  userRegisterValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req as UserSignUpRequest, res, next),
);

export default userRouter;
