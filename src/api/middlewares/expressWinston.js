import expressWinston from 'express-winston';
import Logger from '@loaders/logger';

const expressWinstonLogger = expressWinston.logger({
  // use logger to log every requests
  transports: [Logger.winstonLogger],
  meta: false, // optional: control whether you want to log the meta data about the request (default to true)
  // eslint-disable-next-line max-len
  msg: "{{req.ip}} - {{res.statusCode}} - {{req.method}} - {{res.responseTime}}ms - {{req.url}} - {{req.headers['user-agent']}}",
  expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true,
  ignoreRoute(req) {
    if (req.url === '/status') {
      return true;
    }
    return false;
  },
});

export default expressWinstonLogger;
