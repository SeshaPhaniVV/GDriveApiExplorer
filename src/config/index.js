import 'dotenv/config';
import { name } from '@root/package.json';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default class Config {
  static port = parseInt(process.env.PORT, 10);

  static logs = {
    PAPERTRAIL_HOST_NAME: 'logs3.papertrailapp.com',
    PAPERTRAIL_HOST_PORT: 12560,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  };

  static cache = {
    ACCESS_KEY: process.env.REDIS_ACCESS_KEY,
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
  };

  static api = {
    prefix: '/api',
  };

  static getAppEnv() {
    return process.env.NODE_ENV;
  }

  static getAppName() {
    return name;
  }
}
