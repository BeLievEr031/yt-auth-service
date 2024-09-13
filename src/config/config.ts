import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const { PORT } = process.env;

const Config = {
  PORT,
} as const;

export default Config;
