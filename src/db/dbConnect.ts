import mongoose from 'mongoose';
import logger from '../config/logger';
import Config from '../config/config';

const dbConnect = async () => {
  try {
    await mongoose.connect(Config.DB_URI!);
    logger.info('MongoDB connected successfully');
    mongoose.connection.on('disconnected', () =>
      logger.info('MongoDB disconnected'),
    );
    mongoose.connection.on('connected', () =>
      logger.info('MongoDB connected successfully'),
    );
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

export default dbConnect;
