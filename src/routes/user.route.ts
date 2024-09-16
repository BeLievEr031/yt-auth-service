import { Request, Response, NextFunction, Router } from 'express';
import AuthController from '../controllers/AuthController';
import { AuthService } from '../services';

const userRouter = Router();
const authService = new AuthService();
const authController = new AuthController(authService);
userRouter.post(
  '/register',
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

export default userRouter;
