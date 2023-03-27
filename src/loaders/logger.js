import winston from 'winston';
import os from 'os';
import config from '@config';
import pkg from '@root/package.json';
import { PapertrailConnection, PapertrailTransport } from 'winston-papertrail';

const { name: appName } = pkg;
// Remove the default console transport if it exists.
winston.remove(winston.transports.Console);

// Requiring `winston-papertrail` will expose
// `winston.transports.Papertrail`
const logLevels = {
  error: 0,
  warn: 1,
  help: 2,
  data: 3,
  info: 4,
  debug: 5,
  prompt: 6,
  verbose: 7,
  input: 8,
  silly: 9,
};

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.label({ label: appName }),
    winston.format.colorize(),
    winston.format.printf(
      (info) => `${info.timestamp} pid: ${process.pid} ${info.level} [${info.label}]: ${info.message}`,
    ),
  ),
});

const paperTrailConnection = new PapertrailConnection({
  host: config.logs.PAPERTRAIL_HOST_NAME,
  port: config.logs.PAPERTRAIL_HOST_PORT,
});

paperTrailConnection.on('error', (err) => {
  // Handle, report, or silently ignore connection errors and failures
  // eslint-disable-next-line no-console
  console.log(err);
});

const paperTrailOptions = {
  colorize: true,
  level: config.logs.LOG_LEVEL,
  logFormat(level, message) {
    return `${level} : ${message}`;
  },
  inlineMeta: false,
  hostname: `${appName}|${config.getAppEnv()}`,
  program: `${os.hostname()}`,
};

/*
 * There are also a number of settings for connection failure and retry behavior
 attemptsBeforeDecay - How many retries should be attempted before backing off, defaults to 5
 maximumAttempts - How many retries before disabling buffering, defaults to 25
 connectionDelay - How long between backoff in milliseconds, defaults to 1000
 maxDelayBetweenReconnection - The maximum backoff in milliseconds, defaults to 60000
 maxBufferSize - The maximum size of the retry buffer, in bytes, defaults to 1048576
 */

const paperTrailTransport = new PapertrailTransport(paperTrailConnection, paperTrailOptions);

const logger = winston.createLogger({
  // change level if in dev environment versus production
  level: config.logs.LOG_LEVEL,
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: config.getAppEnv() === 'development' ? [consoleTransport] : [paperTrailTransport],
});

// if(config.getAppEnv() !== 'production'){
//     logger.remove(paperTrailTransport);
// }

/**
 * This function normalize an object to be logged according to winston.
 * @param dataObj: input dataObj of type object
 * @returns {*}: returns normalized dataObj of type object.
 */
const normalizeData = (dataObj, level) => {
  let data = dataObj;
  data.log_level_name = level;
  data = JSON.stringify(dataObj);
  return data;
};

const setOptions = (options) => {
  if (options && options.level) {
    logger.level = options.level;
  }
};

setOptions({ level: config.logs.LOG_LEVEL });

const LoggerInstance = {
  winstonLogger: logger,
  /**
   * Winston function wrappers for logging.
   * @param msg: The message to log.
   * @param dataObj: (Optional) The detailed data object to be logged, apart from message. If provided, it must be
   * a JSON Object.
   */
  fatal: (msg, dataObj) => {
    const data = dataObj || {};
    const message = Object.keys(data).length ? ` ${msg} | meta : ${normalizeData(dataObj, 'fatal')}` : msg;
    logger.error(message);
  },
  /**
   * Winston function wrappers for logging.
   * @param msg: The message to log.
   * @param dataObj: (Optional) The detailed data object to be logged, apart from message. If provided, it must be
   * @param err: Js Error Object to print stack trace
   * a JSON Object.
   */
  error: (msg, dataObj, err = {}) => {
    const data = dataObj || {};
    const message = Object.keys(data).length
      ? ` ${msg} \n meta : ${normalizeData(data, 'error')}, stack: \n ${err.stack} \n `
      : msg;
    logger.error(message);
  },
  /**
   * Winston function wrappers for logging.
   * @param msg: The message to log.
   * @param dataObj: (Optional) The detailed data object to be logged, apart from message. If provided, it must be
   * a JSON Object. If the object is flat, it will be printed on the same line as long as other log information.
   * If the object contains nested objects (or maps), the inner objects will be printed in multi-line YAML format
   */
  warn: (msg, dataObj) => {
    const data = dataObj || {};
    const message = Object.keys(data).length ? ` ${msg} | meta : ${normalizeData(dataObj, 'warn')}` : msg;
    logger.warn(message);
  },
  /**
   * Winston function wrappers for logging.
   * @param msg: The message to log.
   * @param dataObj: (Optional) The detailed data object to be logged, apart from message. If provided, it must be
   * a JSON Object.
   */
  info: (msg, dataObj) => {
    const data = dataObj || {};
    const message = Object.keys(data).length ? ` ${msg} | meta : ${normalizeData(dataObj, 'info')}` : msg;
    logger.info(message);
  },
  /**
   * Winston function wrappers for logging.
   * @param msg: The message to log.
   * @param dataObj: (Optional) The detailed data object to be logged, apart from message. If provided, it must be
   * a JSON Object.
   * */
  debug: (msg, dataObj) => {
    const data = dataObj || {};
    const message = Object.keys(data).length ? ` ${msg} | meta : ${normalizeData(dataObj, 'debug')}` : msg;
    logger.debug(message);
  },
  /**
   * Winston function wrappers for logging.
   * @param msg: The message to log.
   * @param dataObj: (Optional) The detailed data object to be logged, apart from message. If provided, it must be
   * a JSON Object.
   */
  trace: (msg, dataObj) => {
    const data = dataObj || {};
    const message = Object.keys(data).length ? ` ${msg} | meta : ${normalizeData(dataObj, 'trace')}` : msg;
    logger.verbose(message);
  },
};

export default LoggerInstance;
