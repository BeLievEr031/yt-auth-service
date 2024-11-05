import { Types } from 'mongoose';
import Bid from '../models/Bid';
import User from '../models/User';

class WorkerService {
  constructor(
    private userRepository: typeof User,
    private bidRepository: typeof Bid,
  ) {}

  async fetchWorkers(page: number, limit: number, sort: string) {
    const totalCount = await this.userRepository.countDocuments({
      role: 'worker',
    });
    const workers = await this.userRepository
      .find({
        role: 'worker',
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({
        cratedAt: sort === 'asc' ? 1 : -1,
      });

    return { workers, totalCount };
  }

  async fetchWorkerBids(
    userId: Types.ObjectId,
    page: number,
    limit: number,
    sort: string,
  ) {
    const totalWorkerBidCount = await this.bidRepository.countDocuments({
      workerId: userId,
    });
    const workerBids = await this.bidRepository
      .find({
        workerId: userId,
      })
      .populate({
        path: 'problemId',
        select: 'title description status',
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({
        createdAt: sort === 'asc' ? 1 : -1,
      });

    return { totalWorkerBidCount, workerBids };
  }

  async checkForBidPlacedOrNot(
    userId: Types.ObjectId,
    problemId: Types.ObjectId,
  ) {
    return await this.bidRepository.findOne({
      $and: [{ problemId }, { workerId: userId }],
    });
  }
}

export default WorkerService;
