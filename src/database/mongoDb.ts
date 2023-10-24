import mongoose from 'mongoose';
import logger from '@config/utils/winston';
import 'dotenv/config';

const connectToDB = async () => {
    const {
        DEV_DB_HOST,
        DEV_DB_PORT,
        DEV_DB_NAME,

        PROD_DB_USER,
        PROD_DB_PASSWORD,
        PROD_DB_HOST,
        PROD_DB_NAME,

        TEST_DB_USER,
        TEST_DB_PASSWORD,
        TEST_DB_HOST,
        TEST_DB_NAME,
    } = process.env;
    const env: string = process.env.NODE_ENV ?? 'development';

    interface Config {
        dev: string;
        prod: string;
        test: string;
    }

    const dbConfig: Config = {
        dev: `mongodb://${DEV_DB_HOST}:${DEV_DB_PORT}/${DEV_DB_NAME}`,
        prod: `mongodb+srv://${PROD_DB_USER}:${PROD_DB_PASSWORD}@${PROD_DB_HOST}/${PROD_DB_NAME}`,
        test: `mongodb+srv://${TEST_DB_USER}:${TEST_DB_PASSWORD}@${TEST_DB_HOST}/${TEST_DB_NAME}`,
    };

    let connectionString = '';
    if (Object.keys(dbConfig).includes(env)) {
        connectionString = dbConfig[env as keyof typeof dbConfig];
    } else {
        logger.error('[env] variable is invalid');
        process.exit(1);
    }
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
