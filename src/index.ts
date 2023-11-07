import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import connectToDB from '@database/mongoDb';
import logger from '@config/utils/winston';
import router from '@routes/index';
import ValidationError from '@middleware/errors/ValidationError';
import NotFoundError from '@errors/NotFoundError';
import UnknownError from '@errors/UnknownError';
import CastError from '@middleware/errors/CastError';

const app = express();
app.use(express.json());
app.use('/', router);
app.use(ValidationError);
app.use(NotFoundError);
app.use(CastError);
app.use(UnknownError);

const { PORT } = process.env;
connectToDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`server listening on port ${PORT}`);
    });
});
