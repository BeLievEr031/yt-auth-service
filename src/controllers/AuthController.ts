import { Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { UserSignUpRequest } from '../types';
import { validationResult } from 'express-validator';

class AuthController {
  constructor(private authService: AuthService) {}

  register(req: UserSignUpRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.status(200).json({
      ip: req.ip,
      method: req.method,
      url: req.url,
    });

    this.authService.run();
    next();
  }
}

// Validate

export default AuthController;
