import mongoose from 'mongoose';
import logger from '../utils/winston';
import 'dotenv/config';

const connectToDB = async () => {
    const {
        LOCAL_CONNECTION_STRING,
        LOCAL_DB_NAME,
        NODE_ENV,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_HOST_UAT,
    } = process.env;

    // connectionString format: 'mongodb+srv://<username>:<password>@<db host>/<database name>
    // const connectionString = 'mongodb+srv://liyansong2abc:liyansong2A@metaform-cluster.o9dgo23.mongodb.net/metaform';

    let connectionString = '';
    if (NODE_ENV === 'production' || NODE_ENV === 'uat') {
        connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${
            NODE_ENV === 'production' ? DB_HOST : DB_HOST_UAT
        }/${DB_NAME}`;
    } else {
        connectionString = `${LOCAL_CONNECTION_STRING}/${LOCAL_DB_NAME}`;
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
