import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ProblemRequest } from '../types';

class UserController {
  postProblem(req: ProblemRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      res.status(200).json({ data: req.body, user: req.auth });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
