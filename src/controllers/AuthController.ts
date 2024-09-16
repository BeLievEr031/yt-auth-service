import { Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { UserSignUpRequest } from '../types';
import { validationResult } from 'express-validator';
import User from '../models/User';
import createHttpError from 'http-errors';

class AuthController {
  constructor(private authService: AuthService) {}

  public async register(
    req: UserSignUpRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, name } = req.body;
      this.authService.run();

      let user = await User.findOne({ email });
      if (user) {
        const err = createHttpError(400, 'Email alreday exist.');
        next(err);
        return;
      }
      // Hash password
      user = await User.create({ email, password, name });
      res.status(200).json({ user, message: 'User created.' });
    } catch (error) {
      next(error);
      return;
    }
  }
}

// Validate

export default AuthController;
