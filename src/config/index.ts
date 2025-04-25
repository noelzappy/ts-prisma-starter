import { config } from 'dotenv';

config();

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const {
  NODE_ENV,
  PORT,

  SECRET_KEY,

  DATABASE_URL,

  CLIENT_URL,

  REDIS_URL,

  BULL_BOARD_USERNAME,
  BULL_BOARD_PASSWORD,
} = process.env;
