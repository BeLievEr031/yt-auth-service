import { ToObjectId } from './../utils/index';
import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
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
import createHttpError from 'http-errors';

class BidController {
  constructor(private bidService: BidService) {}
  async placeBid(req: PlaceBidRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const bidData = {
        amount: Number(req.body.amount),
        problemId: ToObjectId(String(req.body.problemId)),
        workerId: ToObjectId(String(req.auth.id)),
      };

      const bid = await this.bidService.placeBid(bidData);
      res.status(200).json({
        data: bid,
        message: 'Bid placed.',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBid(req: UpdateBidRequest, res: Response, next: NextFunction) {
    try {
      // UpdateBidRequest
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const bidData = {
        amount: Number(req.body.amount),
        problemId: ToObjectId(String(req.body.problemId)),
        workerId: ToObjectId(String(req.auth.id)),
      };

      const { bidId } = req.params;
      const updatedBid = await this.bidService.updateBid(
        ToObjectId(bidId),
        bidData,
      );
      if (!updatedBid) {
        const err = createHttpError(400, "Couldn't update");
        next(err);
      }

      res.status(200).json({
        data: updatedBid,
        message: 'Bid updated.',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBid(req: DeleteBidRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { bidId } = req.params;
      const { id: workerId } = req.auth;

      const deletedBid = await this.bidService.deleteBid(
        ToObjectId(bidId),
        ToObjectId(workerId),
      );
      if (!deletedBid) {
        const err = createHttpError(400, "Couldn't delete");
        next(err);
      }

      res.status(200).json({
        message: 'Bid deleted.',
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchBidByWorkerIdAndProblemId(
    req: FetchBidRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { page, limit, sort, sortBy, problemId } = req.query;
      let fetchById = null;
      if (sortBy === 'problemid' && problemId) {
        fetchById = problemId;
      } else {
        const { id: workerId } = req.auth;
        fetchById = workerId;
      }

      const { bids, total } = await this.bidService.fetchBidByWorkerId(
        ToObjectId(fetchById),
        Number(page),
        Number(limit),
        sort,
        sortBy,
      );

      res.status(200).json({
        data: bids,
        count: total,
        message: 'Bids fetched.',
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchAllBidsByProblemId(
    req: FetchBidByProblemIdRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { page, limit, sort } = req.query;
      const { id } = req.params;
      const { bids, totalCount } = await this.bidService.fetchBidsByProblemId(
        ToObjectId(id),
        Number(page),
        Number(limit),
        sort,
      );

      res.status(200).json({
        bids,
        totalCount,
        message: 'bid fetch successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptBid(req: AcceptBidRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const acceptedBid = await this.bidService.acceptBid(ToObjectId(id));

      res.status(200).json({
        data: acceptedBid,
        message: 'bid fetch successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BidController;
