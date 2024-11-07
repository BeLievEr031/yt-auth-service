import { Request, Response, NextFunction } from 'express';
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import {
  CheckForBidPlacedOrNotValidator,
  fetchWorkerValidator,
} from '../validators/worker-validator';
import WorkerService from '../services/WorkerService';
import User from '../models/User';
import WorkerController from '../controllers/WorkerController';
import {
  CheckForBidPlacedOrNotRequest,
  FetchWorkerBidsRequest,
  FetchWorkersRequest,
} from '../types';
import Bid from '../models/Bid';
import canAcccess from '../middleware/canAccess';

const workerRouter = Router();
const workerService = new WorkerService(User, Bid);
const workerController = new WorkerController(workerService);

workerRouter.get(
  '/',
  fetchWorkerValidator,
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    workerController.fetchproblems(req as FetchWorkersRequest, res, next),
);

workerRouter.get(
  '/my-bids',
  authenticate,
  canAcccess(['worker', 'user']),
  (req: Request, res: Response, next: NextFunction) =>
    workerController.fetchWorkerBid(req as FetchWorkerBidsRequest, res, next),
);

workerRouter.get(
  '/check-bid-place/:id',
  CheckForBidPlacedOrNotValidator,
  authenticate,
  canAcccess(['worker']),
  (req: Request, res: Response, next: NextFunction) =>
    workerController.checkForBidPlacedOrNot(
      req as CheckForBidPlacedOrNotRequest,
      res,
      next,
    ),
);

export default workerRouter;
