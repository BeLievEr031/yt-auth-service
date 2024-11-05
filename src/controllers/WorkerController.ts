import { ToObjectId } from './../utils/index';
import { Response, NextFunction } from 'express';
import WorkerService from '../services/WorkerService';
import {
  CheckForBidPlacedOrNotRequest,
  FetchWorkerBidsRequest,
  FetchWorkersRequest,
} from '../types';
import { validationResult } from 'express-validator';

class WorkerController {
  constructor(private workerService: WorkerService) {}

  async fetchproblems(
    req: FetchWorkersRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { page, limit, sort } = req.query;

      const { workers, totalCount } = await this.workerService.fetchWorkers(
        Number(page),
        Number(limit),
        sort,
      );
      res.status(200).json({
        data: workers,
        totalCount,
        message: 'Workers fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchWorkerBid(
    req: FetchWorkerBidsRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { page, limit, sort } = req.query;
      const { id } = req.auth;
      const { totalWorkerBidCount, workerBids } =
        await this.workerService.fetchWorkerBids(
          ToObjectId(id),
          Number(page),
          Number(limit),
          sort,
        );

      res.status(200).json({
        data: workerBids,
        totalWorkerBidCount,
        message: 'Worker bids fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async checkForBidPlacedOrNot(
    req: CheckForBidPlacedOrNotRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { id: userId } = req.auth;
      const bidData = await this.workerService.checkForBidPlacedOrNot(
        ToObjectId(userId),
        ToObjectId(id),
      );

      res.status(200).json({
        data: bidData,
        message: 'Worker bid fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default WorkerController;
