import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const {
  PORT,
  DB_URI,
  NODE_ENV,
  SALT_ROUND,
  REFRESH_TOKEN_SCERET,
  JWKS_URI,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_HOST_USER,
  MAIL_HOST_PASS,
} = process.env;

const Config = {
  PORT,
  DB_URI,
  NODE_ENV,
  SALT_ROUND,
  REFRESH_TOKEN_SCERET,
  JWKS_URI,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_HOST_USER,
  MAIL_HOST_PASS,
} as const;

export default Config;
