import BaseError from './BaseError';
import HttpStatusCodes from './HttpStatusCodes';

export default class PayloadValidationError extends BaseError {
  constructor(description = 'Invalid payload received') {
    super('INVALID PAYLOAD', HttpStatusCodes.INVALID_PAYLOAD, description);
  }
}
