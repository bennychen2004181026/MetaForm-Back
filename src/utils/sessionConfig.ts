import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import EnvConfig from '@interfaces/EnvConfig';
import logger from '@config/utils/winston';

const sessionConfig = (app: express.Application): void => {
    const {
        DEV_DB_HOST,
        DEV_DB_PORT,
        DEV_DB_NAME,
        DEV_SESSION_SECRET,

        PROD_DB_USER,
        PROD_DB_PASSWORD,
        PROD_DB_HOST,
        PROD_DB_NAME,
        PROD_SESSION_SECRET,

        TEST_DB_USER,
        TEST_DB_PASSWORD,
        TEST_DB_HOST,
        TEST_DB_NAME,
        TEST_SESSION_SECRET,
    } = process.env;

    const env: keyof EnvConfig = (process.env.NODE_ENV as keyof EnvConfig) || 'development';

    const dbStrings: EnvConfig = {
        development: `mongodb://${DEV_DB_HOST}:${DEV_DB_PORT}/${DEV_DB_NAME}`,
        production: `mongodb+srv://${PROD_DB_USER}:${PROD_DB_PASSWORD}@${PROD_DB_HOST}/${PROD_DB_NAME}`,
        test: `mongodb+srv://${TEST_DB_USER}:${TEST_DB_PASSWORD}@${TEST_DB_HOST}/${TEST_DB_NAME}`,
    };

    const sessionSecrets: EnvConfig = {
        development: `${DEV_SESSION_SECRET}`,
        production: `${PROD_SESSION_SECRET}`,
        test: `${TEST_SESSION_SECRET}`,
    };

    const sessionSecret: string = sessionSecrets[env];
    const mongoUrl: string = dbStrings[env];

    if (!sessionSecret || !mongoUrl) {
        logger.error('Session secret or MongoDB URI is not defined');
        process.exit(1);
    }

    app.use(
        session({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl }),
        }),
    );
};

export default sessionConfig;
