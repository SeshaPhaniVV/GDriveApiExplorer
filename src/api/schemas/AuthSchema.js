import autoBind from "auto-bind";
import BaseSchema from "./BaseSchema";

export default class UserSchema extends BaseSchema {
  constructor(container) {
    super(container);
    // Had to do autobind as we are passing function and the execution context changes
    autoBind(this);
  }

  // TODO: update Auth Schema
  reqValidation(req, res, next) {
    const schema = this.joi.object();
    this.validate(req, schema);
    next();
  }
}
