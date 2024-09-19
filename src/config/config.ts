import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const { PORT, DB_URI, NODE_ENV, SALT_ROUND, REFRESH_TOKEN_SCERET, JWKS_URI } =
  process.env;

const Config = {
  PORT,
  DB_URI,
  NODE_ENV,
  SALT_ROUND,
  REFRESH_TOKEN_SCERET,
  JWKS_URI,
} as const;

export default Config;
