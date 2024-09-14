import express from 'express';
import morgan from 'morgan';
import logger from './config/logger';
import Config from './config/config';
import dbConnect from './db/dbConnect';
import { morganStream } from './utils';

const app = express();
app.use(morgan('tiny', { stream: morganStream }));

const startServer = () => {
  const PORT = Config.PORT;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

dbConnect()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    if (error instanceof Error) {
      logger.error(`Failed to connect db: ${error.message}`);
      process.exit(1);
    }
  });
