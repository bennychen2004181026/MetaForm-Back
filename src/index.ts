import 'dotenv/config';
import express from 'express';
import logger from '@config/utils/winston';
import router from '@routes/index';
import connectToDB from '@database/mongoDb';

const app = express();
app.use(express.json());
app.use('/', router);

const { PORT } = process.env;
connectToDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`server listening on port ${PORT}`);
  });
});
