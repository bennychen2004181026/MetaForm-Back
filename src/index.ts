import 'dotenv/config';
import express from 'express';
import logger from './utils/winston';
import connectToDB from './database/db';

const app = express();
const { PORT } = process.env;
connectToDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`server listening on port ${PORT}`);
  });
});
