import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const { PORT, DB_URI, NODE_ENV, SALT_ROUND } = process.env;

const Config = {
  PORT,
  DB_URI,
  NODE_ENV,
  SALT_ROUND,
} as const;

export default Config;
