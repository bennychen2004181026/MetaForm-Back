import 'dotenv/config';

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
const env = process.env.NODE_ENV ?? 'dev';
const config = {
  dev: `mongodb://${DEV_DB_HOST}:${DEV_DB_PORT}/${DEV_DB_NAME}`,
  prod: `mongodb+srv://${PROD_DB_USER}:${PROD_DB_PASSWORD}@${PROD_DB_HOST}/${PROD_DB_NAME}`,
  test: `mongodb+srv://${TEST_DB_USER}:${TEST_DB_PASSWORD}@${TEST_DB_HOST}/${TEST_DB_NAME}`,
};
// eslint-disable-next-line no-console
console.log(env);
const connectionString = config[env as keyof typeof config];

export default connectionString;
