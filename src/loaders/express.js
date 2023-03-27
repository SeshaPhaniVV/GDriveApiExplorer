import express from "express";
import cors from "cors";
import config from "@config";
import routes from "@api/index";
import swagger from "./swagger";

export default ({ app, Logger }) => {
  /**
   * Health Check endpoints
   */

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb" }));

  app.get("/status", (req, res) => {
    res.status(200).end("ok");
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  app.get("", (req, res) => {
    res.status(200).end("Welcome to VVS Basic Node Backend Service");
  });

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  swagger({ app });
  Logger.info("✌️ Swagger loaded");

  // Useful if behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy");

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Load API routes
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === "UnauthorizedError") {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const statusCode = err.status || err.httpCode || err.code || 500;
    if (statusCode === 500) {
      Logger.error(err.message, {}, err);
    }
    res.status(statusCode);
    res.json({
      message: err.message,
      statusCode,
    });
  });
};
