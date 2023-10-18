import 'dotenv/config';
import express from 'express';
import logger from './utils/winston';
import connectToDB from './database/db';

connectToDB();
const app = express();
const { PORT } = process.env;
app.listen(PORT, () => {
    logger.info(`App is listening on ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Hello');
});
