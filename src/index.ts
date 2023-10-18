import 'dotenv/config';
import express from 'express';
import connectToDB from './database/db';
import logger from './utils/winston';

connectToDB();
const app = express();
const { PORT } = process.env;
app.listen(PORT, () => {
    logger.info(`App is listening on ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Hello');
});
