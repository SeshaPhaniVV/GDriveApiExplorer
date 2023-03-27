import config from '@config';
import ENVs from '@config/envs';
import Redis from 'ioredis';
import logger from './logger';

let cacheInstance;

function registerLogsOnEvents() {
  cacheInstance.on('error', (error) => {
    const errMsg = error.message;
    logger.error(`Error in ioredis client: ${errMsg}`);
  });

  cacheInstance.on('end', () => {
    logger.error('End received from ioredis client');
  });

  cacheInstance.on('reconnecting', (time) => {
    logger.debug(`Reconnecting received from ioredis client after ${time} ms`);
  });
}

export default () => {
  const appEnv = config.getAppEnv();
  if (cacheInstance) {
    return cacheInstance;
  }
  const { ACCESS_KEY, HOST, PORT } = config.cache;

  if (appEnv !== ENVs.dev) {
    cacheInstance = new Redis(`rediss://:${ACCESS_KEY}@${HOST}:${PORT}`);
  } else {
    cacheInstance = new Redis(`redis://${HOST}:${PORT}`);
  }

  registerLogsOnEvents();

  return cacheInstance;
};
