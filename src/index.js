require('dotenv').config();

const express = require('express');
const connectToDB = require('./database/db');

const logger = require('./utils/winston');

connectToDB();
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`App is listening on ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});
