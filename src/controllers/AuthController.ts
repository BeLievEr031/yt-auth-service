import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';

class AuthController {
  constructor(private authService: AuthService) {}

  register(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      ip: req.ip,
      method: req.method,
      url: req.url,
    });
    this.authService.run();
    next();
  }
}

export default AuthController;
