import mongoose from 'mongoose';
import logger from '../utils/winston';
import 'dotenv/config';
import connectionString from './dbConfig';

const connectToDB = async () => {
  if (!connectionString) {
    logger.error('connection string is not defined');
    process.exit(1);
  }

  const connect = async () => {
    try {
      await mongoose.connect(connectionString);
      logger.info(`Successfully connected to database: ${connectionString}`);
    } catch (error) {
      logger.error(`Error connecting to database:${connectionString} `, error);
      process.exit(1);
    }
  };
  connect();

  mongoose.connection.on('disconnected', () => {
    logger.info('mongodb connection lost');
  });
};
export default connectToDB;
