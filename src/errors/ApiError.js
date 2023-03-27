import BaseError from './BaseError';
import HttpStatusCodes from './HttpStatusCodes';

export default class APIError extends BaseError {
  constructor(name, httpCode = HttpStatusCodes.INTERNAL_SERVER, description = 'internal server error') {
    super(name, httpCode, description);
  }
}
