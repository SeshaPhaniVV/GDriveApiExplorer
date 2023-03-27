import PayloadValidationError from '@errors/PayloadValidationError';

class BaseSchema {
  /** @type import('joi') */
  joi;

  /** @type import('@loaders/logger') */
  logger;

  constructor(container) {
    this.container = container;
    this.logger = this.container.get('logger');
    this.joi = this.container.get('joi');
  }

  constructPayload(req) {
    let payload = {};
    try {
      payload = {
        body: req.body || {},
        params: req.params || {},
        query: req.query || {},
      };

      const finalPayload = {};

      Object.values(payload).forEach((value) => {
        Object.keys(value).forEach((payloadKey) => {
          finalPayload[payloadKey] = value[payloadKey];
        });
      });

      return finalPayload;
    } catch (err) {
      this.logger.error(`Error while constructing the payload, ${err.message}`, payload, err);
      throw new Error('Error while constructing the payload.');
    }
  }

  validate(req, schema) {
    if (!schema || !req) {
      // TODO: create payload validation error.
      // throw new Error('Schema or payload is empty');
    }

    const payload = this.constructPayload(req);

    const { value: validatedPayload, error } = schema.validate(payload, { abortEarly: false });

    if (error) {
      const errMessage = error.message;
      this.logger.error(errMessage, payload, error);
      throw new PayloadValidationError(`Invalid payload : ${errMessage.replace(/"/g, "'")}`);
    }

    // Assigning the validated payload object to request.
    req.validatedPayload = validatedPayload;
    return validatedPayload;
  }
}

export default BaseSchema;
