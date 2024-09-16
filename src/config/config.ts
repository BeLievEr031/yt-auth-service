import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const { PORT, DB_URI, NODE_ENV } = process.env;

const Config = {
  PORT,
  DB_URI,
  NODE_ENV,
} as const;

export default Config;
