import { Response, NextFunction } from 'express';
import { AuthService } from '../services';
import {
  AuthenticateReq,
  ChangePasswordRequest,
  ForgetPassword,
  User,
  UserSignInRequest,
  UserSignUpRequest,
} from '../types';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import QueryService from '../services/QueryService';
import bcrypt from 'bcryptjs';
import logger from '../config/logger';
import Config from '../config/config';
import TokenService from '../services/TokenService';
import { JwtPayload } from 'jsonwebtoken';
import UserDto from '../dtos/Auth-dto';
import { Types } from 'mongoose';
import MailService from '../services/MailService';

class AuthController {
  constructor(
    private authService: AuthService,
    private queryService: QueryService,
    private tokenService: TokenService,
    private userDto: UserDto,
    private mailService: MailService,
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

  async login(req: UserSignInRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const user = await this.queryService.findByEmail(email);
      if (!user) {
        const err = createHttpError(401, 'Invalid credentials.');
        next(err);
        return;
      }

      if (user.devices == 0) {
        const err = createHttpError(429, 'Device limit exceeded.');
        next(err);
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        const err = createHttpError(401, 'Invalid credentials.');
        next(err);
        return;
      }

      const payload: JwtPayload = {
        id: user._id,
        email: user.email,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60,
        sameSite: 'strict',
      });

      user.devices = user.devices - 1;
      await user.save();

      const refresh = await this.tokenService.persistRefreshToken(user._id);
      const refreshPayload: JwtPayload = {
        ...payload,
        sub: String(refresh._id),
      };

      const refreshToken =
        this.tokenService.generateRefreshToken(refreshPayload);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        sameSite: 'strict',
      });

      res
        .status(200)
        .json({ user: user, message: 'User logged in successfully' });
    } catch (error) {
      next(error);
      return;
    }
  }

  async self(req: AuthenticateReq, res: Response, next: NextFunction) {
    try {
      const { id } = req.auth;
      const user = await this.queryService.findById(id);

      res.status(200).json({
        user: this.userDto.userDto(user as User),
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthenticateReq, res: Response, next: NextFunction) {
    try {
      const { email } = req.auth;
      const user = await this.queryService.findByEmail(email);
      if (!user) {
        const err = createHttpError(401, 'Invalid credentials.');
        next(err);
        return;
      }

      const payload: JwtPayload = {
        id: user._id,
        email: user.email,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60,
        sameSite: 'strict',
      });

      const refresh = await this.tokenService.persistRefreshToken(user._id);
      const refreshPayload: JwtPayload = {
        ...payload,
        sub: String(refresh._id),
      };

      const refreshToken =
        this.tokenService.generateRefreshToken(refreshPayload);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        sameSite: 'strict',
      });

      res.status(200).json({ message: 'token refreshed.' });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticateReq, res: Response, next: NextFunction) {
    try {
      const { id, sub } = req.auth;

      await this.tokenService.deleteRefreshToken(
        new Types.ObjectId(id),
        new Types.ObjectId(sub),
      );

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async hashPassword(saltRound: number, password: string) {
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async changePassword(
    req: ChangePasswordRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { oldPassword, newPassword } = req.body;
      const { email } = req.auth;

      const user = await this.queryService.findByEmail(email);
      if (!user) {
        const err = createHttpError(401, 'Invalid credentials.');
        next(err);
        return;
      }

      const validPassword = await bcrypt.compare(oldPassword, user.password);
      if (!validPassword) {
        const err = createHttpError(401, 'Invalid credentials.');
        next(err);
        return;
      }

      const hashedPassword = await this.hashPassword(
        +Config.SALT_ROUND!,
        newPassword,
      );

      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req: ForgetPassword, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email } = req.body;
      const user = await this.queryService.findByEmail(email);
      if (!user) {
        const err = createHttpError(401, 'Invalid credentials.');
        next(err);
        return;
      }

      const info = await this.mailService.sendForgetPasswordMail(email);
      res.status(200).json({ info });
    } catch (error) {
      next(error);
    }
  }
}

// Validate

export default AuthController;
