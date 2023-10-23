import 'dotenv/config';
import express from 'express';
import logger from './utils/winston';
import router from './routes';
import connectToDB from './database/db';

const app = express();
app.use(express.json());
app.use('/', router);

const { PORT } = process.env;
connectToDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`server listening on port ${PORT}`);
  });
});
