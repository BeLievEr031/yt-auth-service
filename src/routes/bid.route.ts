import { NextFunction, Response } from 'express';
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import canAcccess from '../middleware/canAccess';
import placeBidRequestValidator, {
  deleteBidRequestValidator,
  fetchBidsValidator,
  updateBidRequestValidator,
} from '../validators/bid-validator';
import BidController from '../controllers/BidController';
import { Request } from 'express-jwt';
import {
  DeleteBidRequest,
  FetchBidRequest,
  PlaceBidRequest,
  UpdateBidRequest,
} from '../types';
import BidService from '../services/BidService';
import Bid from '../models/Bid';

const bidRouter = Router();
const bidService = new BidService(Bid);
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

export default bidRouter;
