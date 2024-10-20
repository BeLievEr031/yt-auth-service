/* eslint-disable @typescript-eslint/no-misused-promises */
import { Response, NextFunction, Router } from 'express';
import { Request } from 'express-jwt';
import authenticate from '../middleware/authenticate';
import UserController from '../controllers/UserController';
import {
  deleteProblemRequestValidator,
  getProblemRequestValidator,
  problemRequestValidator,
  updateStatusWorkerRequestVaidator,
} from '../validators/problem-validatore';
import UserService from '../services/UserService';
import Problem from '../models/Problem';
import {
  deleteProblemRequest,
  fetchOneProblemRequest,
  UpdateProblemStatusWorkerRequest,
} from '../types';

const userRouter = Router();
const userService = new UserService(Problem);
const userController = new UserController(userService);

userRouter.post(
  '/problem',
  authenticate,
  problemRequestValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.postProblem(req, res, next),
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

export default userRouter;
