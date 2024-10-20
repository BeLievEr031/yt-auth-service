import mongoose from 'mongoose';
import logger from '../config/logger';

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export const ToObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id);
};
