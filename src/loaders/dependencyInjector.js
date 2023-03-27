import { Container } from 'typedi';
import joi from 'joi';
import joiDateValidate from '@hapi/joi-date';
import LoggerInstance from './logger';

/**
 * Please do not change the order of injection.
 */
export default ({ postgresDb, cacheInstance, services, transformers }) => {
  try {
    const JoiInstance = joi.extend(joiDateValidate);

    Container.set('postgresDb', postgresDb);
    Container.set('logger', LoggerInstance);
    Container.set('joi', JoiInstance);
    Container.set('cache', cacheInstance);

    // Register transformers first as services are dependent on transformers.
    transformers.forEach((Transformer) => {
      Container.set(Transformer.name, new Transformer(Container));
    });

    services.forEach((Service) => {
      Container.set(Service.name, new Service(Container));
    });
    return Container;
  } catch (e) {
    LoggerInstance.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};
