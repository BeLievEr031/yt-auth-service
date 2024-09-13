import express from 'express';
import logger from './config/logger';
import Config from './config/config';

const app = express();

const startServer = () => {
  app.listen(Config.PORT, () => {
    logger.error(`Connected to server ${Config.PORT}`);
  });
};

startServer();
