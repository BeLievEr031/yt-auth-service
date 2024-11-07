import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  AuthenticateReq,
  BecomeWorkerRequest,
  deleteProblemRequest,
  EditProblemRequest,
  FetchManyProblemRequest,
  fetchOneProblemRequest,
  PostProblemRequest,
  UpdateProblemStatusWorkerRequest,
} from '../types';
import { Request } from 'express-jwt';
import UserService from '../services/UserService';
import { ToObjectId } from '../utils';
import createHttpError from 'http-errors';
import Config from '../config/config';

class UserController {
  constructor(private userService: UserService) {}

  generateProblemSignUrl(_req: Request, res: Response, next: NextFunction) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = Config.cloudinary.utils.api_sign_request(
        { timestamp },
        Config.CLOUDINARY_API_SECRET!,
      );

      res
        .status(200)
        .json({ signature, timestamp, message: 'Signed url generated.' });
    } catch (error) {
      next(error);
    }
  }
  async postProblem(
    req: PostProblemRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const problemData = {
        creatorId: ToObjectId((req.auth as Record<string, string>).id),
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
        imageSrc: req.body.imageSrc,
      };

      console.log(req.files);

      const problem = await this.userService.postProblem(problemData);

      res.status(200).json({ data: problem, user: req.auth });
    } catch (error) {
      next(error);
    }
  }

  async fetchManyProblems(
    req: FetchManyProblemRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { limit, page, sort } = req.query;
      const userid = req.auth.id;
      const role = req.auth.role;
      const problem = await this.userService.fetchProblems(
        ToObjectId(userid),
        +page,
        +limit,
        sort,
        role,
      );

      res
        .status(200)
        .send({ data: problem, message: 'Problem fetched successfully' });
    } catch (error) {
      next(error);
    }
  }

  async fetchOneProblem(
    req: fetchOneProblemRequest,
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
      const userid = req.auth.id;
      const problem = await this.userService.fetchOneProblem(
        ToObjectId(id),
        ToObjectId(userid),
      );

      res
        .status(200)
        .send({ data: problem, message: 'Problem fetched successfully' });
    } catch (error) {
      next(error);
    }
  }

  async editProblem(
    req: EditProblemRequest,
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

      const prevProblemData = {
        creatorId: ToObjectId(req.auth.id),
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
        imageSrc: req.body.imageSrc,
      };

      const editedProblem = await this.userService.editProblem(
        ToObjectId(id),
        ToObjectId(req.auth.id),
        prevProblemData,
      );
      res.status(200).json({
        data: editedProblem,
        message: 'Problem updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatusAndWorker(
    req: UpdateProblemStatusWorkerRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.auth;
      const { id: problemId } = req.params;
      const { status, workerId } = req.query;

      const updatedProblem = await this.userService.updateStatusOrWorker(
        ToObjectId(id),
        ToObjectId(problemId),
        status,
        ToObjectId(workerId),
      );

      if (!updatedProblem) {
        const err = createHttpError(404, 'Invalid problem');
        next(err);
        return;
      }

      res.status(200).json({
        data: updatedProblem,
        message: 'Problem status or worker updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProblem(
    req: deleteProblemRequest,
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
      const { id: userid } = req.auth;
      const isDeleted = await this.userService.deleteProblem(
        ToObjectId(id),
        ToObjectId(userid),
      );

      if (!isDeleted) {
        const err = createHttpError(404, 'Invalid problem');
        next(err);
        return;
      }

      res.status(200).json({
        data: null,
        message: 'Problem deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async userDashboardData(
    req: AuthenticateReq,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { id: userid } = req.auth;

      const { totalRaisedProblems, totalSolvedProlems } =
        await this.userService.userDashboardData(ToObjectId(userid));

      res.status(200).json({
        data: {
          totalRaisedProblems,
          totalSolvedProlems,
        },
        message: 'Problem deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getLastProblemBid(
    req: AuthenticateReq,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { id: userid } = req.auth;

      const lastEntry = await this.userService.getLastProblemBid(
        ToObjectId(userid),
      );

      res.status(200).json({
        data: lastEntry,
        message: 'Problem deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async becomeWorker(
    req: BecomeWorkerRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { initialPrice } = req.body;
      const { id: userid } = req.auth;
      const worker = await this.userService.becomeWorker(
        ToObjectId(userid),
        initialPrice,
      );

      res.status(200).json({
        data: worker,
        message: 'Problem deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
