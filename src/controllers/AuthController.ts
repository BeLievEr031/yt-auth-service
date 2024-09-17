import { Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { UserSignUpRequest } from '../types';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import QueryService from '../services/QueryService';
import bcrypt from 'bcryptjs';
import logger from '../config/logger';
import Config from '../config/config';

class AuthController {
  constructor(
    private authService: AuthService,
    private queryService: QueryService,
  ) {}

  async register(req: UserSignUpRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, name } = req.body;

      let user = await this.queryService.findByEmail(email);
      if (user) {
        const err = createHttpError(400, 'Email alreday exist.');
        next(err);
        return;
      }

      const hashedPassword = await this.hashPassword(
        +Config.SALT_ROUND!,
        password,
      );
      user = await this.authService.create({ email, hashedPassword, name });

      logger.info(`User created successfully!!!`);

      res.status(200).json({ user, message: 'User created.' });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error during user registration: ${error.message}`);
      }
      next(error);
      return;
    }
  }

  async hashPassword(saltRound: number, password: string) {
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}

// Validate

export default AuthController;
