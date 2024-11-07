/* eslint-disable @typescript-eslint/no-misused-promises */
import { Response, NextFunction, Router } from 'express';
import { Request } from 'express-jwt';
import authenticate from '../middleware/authenticate';
import UserController from '../controllers/UserController';
import {
  becomeWorkerValidator,
  deleteProblemRequestValidator,
  getProblemRequestValidator,
  problemRequestValidator,
  updateStatusWorkerRequestVaidator,
} from '../validators/problem-validatore';
import UserService from '../services/UserService';
import Problem from '../models/Problem';
import Bid from '../models/Bid';
import {
  AuthenticateReq,
  BecomeWorkerRequest,
  deleteProblemRequest,
  FetchManyProblemRequest,
  fetchOneProblemRequest,
  UpdateProblemStatusWorkerRequest,
} from '../types';
import { fetchManyProblemValidator } from '../validators/bid-validator';
import canAcccess from '../middleware/canAccess';
import User from '../models/User';

const userRouter = Router();
const userService = new UserService(User, Problem, Bid);
const userController = new UserController(userService);

userRouter.post(
  '/problem-sign-url',
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    userController.generateProblemSignUrl(req, res, next),
);

userRouter.post(
  '/problem',
  authenticate,
  problemRequestValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.postProblem(req, res, next),
);

userRouter.get(
  '/problem',
  authenticate,
  fetchManyProblemValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.fetchManyProblems(req as FetchManyProblemRequest, res, next),
);

userRouter.get(
  '/problem/:id',
  authenticate,
  getProblemRequestValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.fetchOneProblem(req as fetchOneProblemRequest, res, next),
);

// Only route to update the STATUS and WorkerID
// Q:= ?status=unsigned&workerdId=6d45aw548wwwsdesign
userRouter.put('/problem', authenticate);

userRouter.patch(
  '/problem/:id',
  authenticate,
  updateStatusWorkerRequestVaidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateStatusAndWorker(
      req as UpdateProblemStatusWorkerRequest,
      res,
      next,
    ),
);

userRouter.delete(
  '/problem/:id',
  authenticate,
  deleteProblemRequestValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.deleteProblem(req as deleteProblemRequest, res, next),
);

userRouter.get(
  '/dashboard',
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    userController.userDashboardData(req as AuthenticateReq, res, next),
);

userRouter.get(
  '/last-problem',
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getLastProblemBid(req as AuthenticateReq, res, next),
);

userRouter.put(
  '/become-worker',
  becomeWorkerValidator,
  authenticate,
  canAcccess(['user']),
  (req: Request, res: Response, next: NextFunction) =>
    userController.becomeWorker(req as BecomeWorkerRequest, res, next),
);

export default userRouter;
