import 'dotenv/config';
import express from 'express';
import connectToDB from '@database/mongoDb';
import logger from '@config/utils/winston';
import router from '@routes/index';

const app = express();
app.use(express.json());
app.use('/', router);

const { PORT } = process.env;
connectToDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`server listening on port ${PORT}`);
    });
});
