import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { AuthenticateReq } from '../types';
import createHttpError from 'http-errors';

const canAcccess = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const _req = req as AuthenticateReq;
    const role = _req.auth.role;

    if (!roles.includes(role)) {
      const err = createHttpError(400, 'Unauthorized access.');
      next(err);
    }
    next();
  };
};

export default canAcccess;
