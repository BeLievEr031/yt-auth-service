import { Types } from 'mongoose';
import Bid from '../models/Bid';
import { Bid as IBid } from '../types';
import Problem from '../models/Problem';
interface AggregationResult {
  totalCount: { count: number }[];
  bids: IBid[];
}

class BidService {
  constructor(
    private bidRepository: typeof Bid,
    private problemRepository: typeof Problem,
  ) {}
  async placeBid(bidData: IBid) {
    return await this.bidRepository.create(bidData);
  }

  async updateBid(bidId: Types.ObjectId, bidData: IBid) {
    return await this.bidRepository.findOneAndUpdate({
      $and: [
        { _id: bidId },
        { problemId: bidData.problemId },
        { workerId: bidData.workerId },
      ],
      $set: {
        ...bidData,
      },
    });
  }

  async deleteBid(bidId: Types.ObjectId, workerId: Types.ObjectId) {
    return await this.bidRepository.findOneAndDelete({
      $and: [{ _id: bidId }, { workerId: workerId }],
    });
  }

  async fetchBidByWorkerId(
    fetchById: Types.ObjectId,
    page: number,
    limit: number,
    sort: string,
    sortBy: 'workerid' | 'problemid',
  ) {
    const results = await this.bidRepository.aggregate<AggregationResult>([
      {
        $match:
          sortBy === 'workerid'
            ? { workerId: fetchById }
            : { problemId: fetchById },
      },
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          bids: [
            {
              $sort:
                sortBy === 'workerid'
                  ? { createdAt: sort === 'desc' ? -1 : 1 }
                  : { amount: sort === 'desc' ? -1 : 1 },
            },
            { $skip: (page - 1) * limit },
            { $limit: Number(limit) },
          ],
        },
      },
    ]);

    const total =
      results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;
    const bids = results[0].bids;

    return {
      total,
      bids,
    };
  }

  async fetchBidsByProblemId(
    problemId: Types.ObjectId,
    page: number,
    limit: number,
    sort: string,
  ) {
    const totalCount = await this.bidRepository.countDocuments({ problemId });
    const bids = await this.bidRepository
      .find({ problemId })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ amount: sort === 'desc' ? -1 : 1 })
      .populate('workerId');

    return {
      totalCount,
      bids,
    };
  }

  async acceptBid(bid: Types.ObjectId) {
    const bidAccept = await this.bidRepository.findByIdAndUpdate(
      {
        _id: bid,
      },
      {
        $set: {
          status: true,
        },
      },
      {
        new: true,
      },
    );

    await this.problemRepository.findByIdAndUpdate(
      { _id: bidAccept?.problemId },
      {
        $set: {
          status: 'pending',
        },
      },
    );
    return bidAccept;
  }
}

export default BidService;
