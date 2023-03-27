import config from '@config';
import { Sequelize } from 'sequelize';
import envPGConfig from '@config/postgres';
import Logger from '@loaders/logger';

let postgresDb;

export default () => {
  const appEnv = config.getAppEnv();
  const pgConfig = envPGConfig[appEnv];
  if (!postgresDb) {
    postgresDb = new Sequelize(pgConfig.database, pgConfig.username, pgConfig.password, pgConfig);
    postgresDb
      .authenticate()
      .then(() => {
        Logger.info(`Connection to postgres has been established successfully for env: ${appEnv}.`);
      })
      .catch((error) => {
        Logger.error(`Unable to connect to the postgres database: ${error}`);
      });
  }

  return postgresDb;
};
