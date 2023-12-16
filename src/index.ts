import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';

import '@utils/passport';
import connectToDB from '@database/mongoDb';
import logger from '@config/utils/winston';
import morganOption from '@config/utils/morganOption';
import router from '@routes/index';
import sessionConfig from '@utils/sessionConfig';
import ValidationError from '@middleware/errors/ValidationError';
import NotFoundError from '@middleware/errors/NotFoundError';
import UnknownError from '@middleware/errors/UnknownError';
import CastError from '@middleware/errors/CastError';
import middlewares from '@middleware/index';

const corsOptions = {
    origin: `http://localhost:${process.env.FRONT || 3000}`,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', morganOption));
sessionConfig(app);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);
app.use(middlewares.errorHandler);
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
