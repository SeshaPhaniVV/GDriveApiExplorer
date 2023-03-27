import autoBind from "auto-bind";

export default class BaseController {
  constructor(container) {
    this.logger = container.get("logger");
    // Had to do autobind as we are passing function and the execution context changes
    autoBind(this);
  }

  handleError(err, req, res, next) {
    this.logger.error(`Error while serving req ${req.method}-${req.originalUrl}, msg: ${err.message}`, {
      method: req.method,
      url: req.url,
    });

    return next(err);
  }
}
