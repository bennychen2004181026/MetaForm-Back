import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import passport from 'passport'

import '@utils/passport'
import connectToDB from '@database/mongoDb';
import logger from '@config/utils/winston';
import morganOption from '@config/utils/morganOption'
import router from '@routes/index';
import ValidationError from '@middleware/errors/ValidationError';
import NotFoundError from '@errors/NotFoundError';
import UnknownError from '@errors/UnknownError';
import CastError from '@middleware/errors/CastError';
import middlewares from './middlewares';

const app = express();
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', morganOption));
app.use(passport.initialize());

app.use('/', router);
app.use(ValidationError);
app.use(NotFoundError);
app.use(CastError);
app.use(UnknownError);

app.use(middlewares.errorHandler);
const { PORT } = process.env;
connectToDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`server listening on port ${PORT}`);
    });
});
