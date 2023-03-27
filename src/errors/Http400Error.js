import BaseError from './BaseError';
import HttpStatusCodes from './HttpStatusCodes';

export default class Http400Error extends BaseError {
  constructor(description = 'bad request') {
    super('NOT FOUND', HttpStatusCodes.BAD_REQUEST, description);
  }
}
