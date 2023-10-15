require('dotenv').config();

const mongoose = require('mongoose');
const logger = require('../utils/winston');

const connectToDB = async () => {
    const {
        LOCAL_CONNECTION_STRING,
        NODE_ENV,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_HOST_UAT,
    } = process.env;

    // connectionString format: 'mongodb+srv://<username>:<password>@<db host>/<database name>
    // const connectionString = 'mongodb+srv://liyansong2abc:liyansong2A@metaform-cluster.o9dgo23.mongodb.net/metaform';
    const connectionStrings = {
        production: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
        uat: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST_UAT}/${DB_NAME}`,
        development: LOCAL_CONNECTION_STRING,
    };

    const connectionString = connectionStrings[NODE_ENV];

    if (!connectionString) {
        logger.error('connection string is not defined');
        process.exit(1);
    }

    const connect = async () => {
        try {
            await mongoose.connect(connectionString);
            logger.info(`Successfully connected to database: ${connectionString}`);
            return;
        } catch (error) {
            logger.error('Error connecting to database: ', error);
            process.exit(1);
        }
    };
    connect();

    mongoose.connection.on('disconnected', () => {
        logger.info('mongodb connection lost');
    });
};
module.exports = connectToDB;
