import { Types } from 'mongoose';
import Problem from '../models/Problem';
import { Problem as IProblem } from '../types';
import Bid from '../models/Bid';
import User from '../models/User';

interface FetchProblem {
  _id: string; // or ObjectId if you're using Mongoose
  creatorId: string;
  // Add other fields as necessary
  totalBids: number;
  totalCount: number;
}

// interface Bid {
//   _id: Types.ObjectId;
//   amount: number;
//   problemId: Types.ObjectId;
//   bidderId: Types.ObjectId;
// }

interface ProblemWithBids {
  _id: Types.ObjectId;
  title: string;
  description: string;
  creatorId: Types.ObjectId;
  role: string;
  totalBids: number;
  bids: Bid[];
}

class UserService {
  constructor(
    private userRepository: typeof User,
    private problemRepository: typeof Problem,
    private bidRepository: typeof Bid,
  ) {}

  async postProblem(problem: IProblem) {
    return await this.problemRepository.create(problem);
  }

  async fetchProblems(
    userid: Types.ObjectId,
    page: number,
    limit: number,
    sort: string,
    role: string,
  ) {
    console.log(role);

    if (role === 'worker') {
      const problemsWithBids =
        await this.problemRepository.aggregate<FetchProblem>([
          {
            $match: {},
          },
          {
            $lookup: {
              from: 'bids', // Name of the bids collection
              localField: '_id',
              foreignField: 'problemId', // Field in the bids collection that references the problem
              as: 'bids',
            },
          },
          {
            $addFields: {
              totalBids: { $size: '$bids' }, // Count the number of bids
            },
          },
          {
            $project: {
              bids: 0, // Optionally exclude the bids array from the result
            },
          },
          {
            $sort: {
              createdAt: sort === 'desc' ? -1 : 1,
            },
          },
          {
            $facet: {
              results: [
                {
                  $skip: (page - 1) * limit, // Calculate the number of documents to skip
                },
                {
                  $limit: limit, // Limit the number of documents returned
                },
              ],
              totalCount: [
                {
                  $count: 'count', // Count the total number of problems
                },
              ],
            },
          },
        ]);

      return problemsWithBids;
    }

    const problemsWithBids =
      await this.problemRepository.aggregate<FetchProblem>([
        {
          $match: {
            $or: [{ creatorId: userid }, { role: 'worker' }],
          },
        },
        {
          $lookup: {
            from: 'bids', // Name of the bids collection
            localField: '_id',
            foreignField: 'problemId', // Field in the bids collection that references the problem
            as: 'bids',
          },
        },
        {
          $addFields: {
            totalBids: { $size: '$bids' }, // Count the number of bids
          },
        },
        {
          $project: {
            bids: 0, // Optionally exclude the bids array from the result
          },
        },
        {
          $sort: {
            createdAt: sort === 'desc' ? -1 : 1,
          },
        },
        {
          $facet: {
            results: [
              {
                $skip: (page - 1) * limit, // Calculate the number of documents to skip
              },
              {
                $limit: limit, // Limit the number of documents returned
              },
            ],
            totalCount: [
              {
                $count: 'count', // Count the total number of problems
              },
            ],
          },
        },
      ]);

    return problemsWithBids;
  }

  async fetchOneProblem(problemId: Types.ObjectId, userid: Types.ObjectId) {
    const problemWithBids =
      await this.problemRepository.aggregate<ProblemWithBids>([
        {
          $match: {
            $and: [
              { _id: problemId },
              { $or: [{ creatorId: userid }, { role: 'worker' }] },
            ],
          },
        },
        {
          $lookup: {
            from: 'bids', // Name of the bids collection
            localField: '_id', // Field in the problem document
            foreignField: 'problemId', // Field in the bids collection that references the problem
            as: 'bids', // Name of the field to hold the array of bids
          },
        },
        {
          $addFields: {
            totalBids: { $size: '$bids' }, // Add a field for the total number of bids
          },
        },
      ]);

    // Return the first element if the result is found, otherwise return null
    return problemWithBids.length > 0 ? problemWithBids[0] : null;
  }

  async editProblem(
    problemId: Types.ObjectId,
    userid: Types.ObjectId,
    problemData: IProblem,
  ) {
    return await this.problemRepository.findOneAndUpdate(
      {
        $and: [{ _id: problemId }, { creatorId: userid }],
        $set: {
          ...problemData,
        },
      },
      { new: true },
    );
  }

  async updateStatusOrWorker(
    problemId: Types.ObjectId,
    userid: Types.ObjectId,
    status: string,
    workerId: Types.ObjectId,
  ) {
    return await this.problemRepository.findOneAndUpdate(
      {
        $and: [{ _id: problemId }, { creatorId: userid }],
        $set: {
          status,
          workerId,
        },
      },
      { new: true },
    );
  }

  async deleteProblem(problemId: Types.ObjectId, userid: Types.ObjectId) {
    return await this.problemRepository.deleteOne({
      $and: [{ _id: problemId }, { creatorId: userid }],
    });
  }

  async userDashboardData(userid: Types.ObjectId) {
    const totalRaisedProblems = await this.problemRepository.countDocuments({
      creatorId: userid,
    });
    const totalSolvedProlems = await this.problemRepository.countDocuments({
      $and: [
        {
          creatorId: userid,
        },
        {
          status: 'completed',
        },
      ],
    });

    return { totalRaisedProblems, totalSolvedProlems };
  }

  async getLastProblemBid(userid: Types.ObjectId) {
    const lastProblemEntry = await this.problemRepository
      .findOne({ creatorId: userid })
      .sort({ createdAt: -1 });

    // Fetch top 5 bids using bid Model API
    const topFiveBids = await this.bidRepository
      .find({ problemId: lastProblemEntry?._id })
      .limit(5)
      .sort({ amount: 1 })
      .populate({
        path: 'workerId',
        select: 'name phone email',
      });
    return { lastProblemEntry, topFiveBids };
  }

  async becomeWorker(userid: Types.ObjectId, initialPrice: number) {
    return await this.userRepository.findByIdAndUpdate(
      { _id: userid },
      {
        $set: {
          initialPrice,
          role: 'worker',
          // expertiseIN: expertise,
        },
      },
      {
        new: true,
      },
    );
  }
}

export default UserService;
