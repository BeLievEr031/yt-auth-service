import express, { Request, Response } from 'express';
import morgan from 'morgan';
import logger from './config/logger';
import Config from './config/config';

const app = express();
const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

app.use(morgan('tiny', { stream: morganStream }));

app.get('/test-route', (_req: Request, res: Response) => {
  res.json({ success: true });
});

const startServer = () => {
  app.listen(Config.PORT, () => {
    logger.info(`Server is running on port ${Config.PORT}`);
  });
};

startServer();
