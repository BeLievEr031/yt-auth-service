import { Types } from 'mongoose';
import Problem from '../models/Problem';
import { Problem as IProblem } from '../types';
class UserService {
  constructor(private problemRepository: typeof Problem) {}

  async postProblem(problem: IProblem) {
    return await this.problemRepository.create(problem);
  }

  async fetchOneProblem(problemId: Types.ObjectId, userid: Types.ObjectId) {
    return await this.problemRepository.findOne({
      $and: [
        { _id: problemId },
        { $or: [{ creatorId: userid }, { role: 'worker' }] },
      ],
    });
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
}

export default UserService;
