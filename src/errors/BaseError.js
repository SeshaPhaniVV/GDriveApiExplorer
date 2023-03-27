export default class BaseError extends Error {
  name;

  httpCode;

  constructor(name, httpCode, description) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}
