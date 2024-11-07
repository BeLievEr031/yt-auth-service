import dotenvFlow from 'dotenv-flow';
import { v2 as cloudinary } from 'cloudinary';

dotenvFlow.config();

const {
  PORT,
  DB_URI,
  NODE_ENV,
  SALT_ROUND,
  REFRESH_TOKEN_SCERET,
  JWKS_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_HOST_USER,
  MAIL_HOST_PASS,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

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
  cloudinary,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} as const;

export default Config;
