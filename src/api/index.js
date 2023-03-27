import express, { Router } from 'express';
import helmet from 'helmet';
import expressWinstonLogger from './middlewares/expressWinston';
import routes from './routes/routes';

export default () => {
  const app = Router();
  app.use(expressWinstonLogger);
  app.use(helmet());
  app.use(express.json());
  app.use(helmet.frameguard({ action: 'deny' }));

  /**
   * Instantiating routes
   */
  routes(app);

  return app;
};
