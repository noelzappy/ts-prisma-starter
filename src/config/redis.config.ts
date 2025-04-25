import { Redis } from 'ioredis';
import { REDIS_URL } from '@config';
import { logger } from '@/utils/logger';

const conf = new URL(REDIS_URL);

export const RedisOptions = {
  host: conf.hostname,
  port: parseInt(conf.port, 10),
  password: conf.password,
  tls: {},
};

const redis = new Redis(RedisOptions);

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', err => {
  logger.error('Redis error', err);
});

export default redis;
