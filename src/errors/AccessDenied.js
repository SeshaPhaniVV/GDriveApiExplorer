import BaseError from './BaseError';
import HttpStatusCodes from './HttpStatusCodes';

export default class AccessDenied extends BaseError {
  constructor(description = 'access_denied') {
    super('ACCESS DENIED', HttpStatusCodes.ACCESS_DENIED, description);
  }
}
