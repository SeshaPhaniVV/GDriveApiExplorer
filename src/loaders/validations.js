import dotenv from 'dotenv';
import semver from 'semver';
import config from '@config';
import Envs from '@config/envs';
import Logger from '@loaders/logger';
import pkg from '../../package.json';

const { engines } = pkg;
const version = engines.node;

export class NodeServerValidator {
  static validate() {
    if (!semver.satisfies(process.version, version)) {
      Logger.error(`Current Node.js version is ${process.versions.node}. app requires Node.js version: ${version}.`);
      process.exit();
    }

    const envFound = dotenv.config();
    if (config.getAppEnv() === Envs.dev && envFound.error) {
      // This error should crash whole process
      Logger.error("Couldn't find .env file");
    }
  }
}

export default NodeServerValidator;
