import "module-alias/register";
import express from "express";
import config from "@config";
import NodeServerValidator from "@loaders/validations.js";
import Logger from "@loaders/logger";
import Loaders from "@loaders/index";

function errorHandler() {
  process
    .on("unhandledRejection", (err) => {
      Logger.error(
        `Server | Unhandled Rejection happened - ${err.message}`,
        {},
        err
      );
    })
    .on("uncaughtException", (err) => {
      Logger.error(
        `Server | Uncaught Exception happened - ${err.message}`,
        {},
        err
      );
      process.exit(1);
    });
}

async function startServer() {
  errorHandler();
  const app = express();

  NodeServerValidator.validate();
  await Loaders({ expressApp: app });

  app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      #############################################
    `);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
