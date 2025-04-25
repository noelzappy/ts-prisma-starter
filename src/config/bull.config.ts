import Queue from 'bull';
import { RedisOptions } from './redis.config';

function bullQ<T = any>(name: string) {
  return new Queue<T>(name, {
    redis: {
      host: RedisOptions.host,
      port: RedisOptions.port,
      password: RedisOptions.password,
      tls: RedisOptions.tls,
    },
    defaultJobOptions: {
      removeOnComplete: true,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  });
}

export default bullQ;
