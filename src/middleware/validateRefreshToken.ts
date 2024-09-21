import { expressjwt } from 'express-jwt';
import Config from '../config/config';
import { Request } from 'express';
import Refresh from '../models/Refresh';
import { AuthCookie, IRefreshTokenPayload } from '../types';
import logger from '../config/logger';

export default expressjwt({
  secret: Config.REFRESH_TOKEN_SCERET!,
  algorithms: ['HS256'],
  getToken: (req: Request) => {
    const { refreshToken } = req.cookies as AuthCookie;
    return refreshToken;
  },

  async isRevoked(_request: Request, token) {
    try {
      const refreshToken = await Refresh.findOne({
        _id: (token?.payload as IRefreshTokenPayload).sub,
        userid: (token?.payload as IRefreshTokenPayload).id,
      });

      return refreshToken === null;
    } catch (err) {
      if (err instanceof Error) {
        logger.error('Error while getting the refresh token', {
          id: (token?.payload as IRefreshTokenPayload).id,
        });
      }
    }
    return true;
  },
});
