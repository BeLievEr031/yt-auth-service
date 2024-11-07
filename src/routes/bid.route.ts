import { NextFunction, Response } from 'express';
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import canAcccess from '../middleware/canAccess';
import placeBidRequestValidator, {
  acceptBidValidator,
  // acceptBidValidator,
  deleteBidRequestValidator,
  fetchBidsValidator,
  fetchManyProblemValidator,
  updateBidRequestValidator,
} from '../validators/bid-validator';
import BidController from '../controllers/BidController';
import { Request } from 'express-jwt';
import {
  AcceptBidRequest,
  // AcceptBidRequest,
  DeleteBidRequest,
  FetchBidByProblemIdRequest,
  FetchBidRequest,
  PlaceBidRequest,
  UpdateBidRequest,
} from '../types';
import BidService from '../services/BidService';
import Bid from '../models/Bid';
import Problem from '../models/Problem';

const bidRouter = Router();
const bidService = new BidService(Bid, Problem);
const bidController = new BidController(bidService);
bidRouter.post(
  '/',
  authenticate,
  placeBidRequestValidator,
  canAcccess(['worker']),
  (req: Request, res: Response, next: NextFunction) =>
    bidController.placeBid(req as PlaceBidRequest, res, next),
);

bidRouter.put(
  '/:bidId',
  authenticate,
  updateBidRequestValidator,
  canAcccess(['worker']),
  (req: Request, res: Response, next: NextFunction) =>
    bidController.placeBid(req as UpdateBidRequest, res, next),
);

bidRouter.delete(
  '/:bidId',
  authenticate,
  deleteBidRequestValidator,
  canAcccess(['worker']),
  (req: Request, res: Response, next: NextFunction) =>
    bidController.deleteBid(req as DeleteBidRequest, res, next),
);

bidRouter.get(
  '/',
  authenticate,
  fetchBidsValidator,
  canAcccess(['worker']),
  (req: Request, res: Response, next: NextFunction) =>
    bidController.fetchBidByWorkerIdAndProblemId(
      req as FetchBidRequest,
      res,
      next,
    ),
);

// fetch all the bid by problem id
bidRouter.get(
  '/problem/:id',
  authenticate,
  fetchManyProblemValidator,
  canAcccess(['worker', 'user']),
  (req: Request, res: Response, next: NextFunction) =>
    bidController.fetchAllBidsByProblemId(
      req as FetchBidByProblemIdRequest,
      res,
      next,
    ),
);

bidRouter.post(
  '/accept/:id',
  authenticate,
  acceptBidValidator,
  canAcccess(['user']),
  (req: Request, res: Response, next: NextFunction) =>
    bidController.acceptBid(req as AcceptBidRequest, res, next),
);

export default bidRouter;
