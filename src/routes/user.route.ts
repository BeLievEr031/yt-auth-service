/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, NextFunction, Router } from 'express';
import AuthController from '../controllers/AuthController';
import { AuthService } from '../services';
import {
  userLoginValidator,
  userRegisterValidator,
} from '../validators/auth-validator';
import {
  AuthenticateReq,
  UserSignInRequest,
  UserSignUpRequest,
} from '../types';
import User from '../models/User';
import QueryService from '../services/QueryService';
import TokenService from '../services/TokenService';
import Refresh from '../models/Refresh';
import authenticate from '../middleware/authenticate';
import UserDto from '../dtos/Auth-dto';
import validateRefreshToken from '../middleware/validateRefreshToken';

const userRouter = Router();
const authService = new AuthService(User);
const queryService = new QueryService(User);
const tokenService = new TokenService(Refresh);
const userDto = new UserDto();
const authController = new AuthController(
  authService,
  queryService,
  tokenService,
  userDto,
);

userRouter.post(
  '/register',
  userRegisterValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req as UserSignUpRequest, res, next),
);

userRouter.post(
  '/login',
  userLoginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req as UserSignInRequest, res, next),
);

userRouter.get(
  '/self',
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    authController.self(req as AuthenticateReq, res, next),
);

userRouter.get(
  '/refresh-token',
  validateRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refreshToken(req as AuthenticateReq, res, next),
);
export default userRouter;
