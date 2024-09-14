import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const { PORT, DB_URI } = process.env;

const Config = {
  PORT,
  DB_URI,
} as const;

export default Config;
