import { cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    SECRET_KEY: str(),

    DATABASE_URL: str(),
    CLIENT_URL: str(),

    REDIS_URL: str(),

    BULL_BOARD_PASSWORD: str(),
    BULL_BOARD_USERNAME: str(),
  });
};
