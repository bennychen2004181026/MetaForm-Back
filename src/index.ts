import 'dotenv/config';
import express from 'express';
import connectToDB from '@database/mongoDb';
import logger from '@config/utils/winston';
import router from '@routes/index';
import ValidationError from '@errors/ValidationError';
import notFoundError from '@errors/NotFoundError';
import unknownError from '@errors/UnknownError';

const app = express();
app.use(express.json());
app.use('/', router);
app.use(ValidationError);
app.use(notFoundError);
app.use(unknownError);
const { PORT } = process.env;
connectToDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`server listening on port ${PORT}`);
    });
});
