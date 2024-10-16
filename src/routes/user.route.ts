/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, NextFunction, Router } from 'express';
import authenticate from '../middleware/authenticate';
import UserController from '../controllers/UserController';
import { AuthenticateReq, ProblemRequest } from '../types';
import { problemRequestValidator } from '../validators/user-validatore';

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  '/problem',
  authenticate,
  problemRequestValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.postProblem(
      req as ProblemRequest & AuthenticateReq,
      res,
      next,
    ),
);

export default userRouter;
