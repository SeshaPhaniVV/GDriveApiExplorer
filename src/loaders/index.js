import http from "http";
import events from "events";
import postgresDb from "@models/index";
import Logger from "@loaders/logger";
import expressLoader from "./express";
import dependencyInjectorLoader from "./dependencyInjector";
import startCronJobs from "./cronInitiator";
import connectToCache from "./cache";
import AuthService from "@services/AuthService";
import GDriveService from "@services/GDriveService";

export default async ({ expressApp }) => {
  const cacheInstance = connectToCache();

  Logger.info("✌️ Connected to Cache instance");

  http.globalAgent.maxSockets = Infinity;
  process.setMaxListeners(50);
  events.EventEmitter.defaultMaxListeners = 50;

  await dependencyInjectorLoader({
    postgresDb,
    cacheInstance,
    services: [AuthService, GDriveService],
    transformers: [],
  });
  Logger.info("✌️ Dependency Injector loaded");

  await expressLoader({ app: expressApp, Logger });
  Logger.info("✌️ Express loaded");

  await startCronJobs();
  Logger.info("✌️ Cron Jobs initiated");
};
