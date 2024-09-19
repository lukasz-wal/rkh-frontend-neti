import * as dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import "@src/api/http/controllers/index.js";

import { Application, urlencoded, json } from "express";

import config from "@src/config";
import { TYPES } from "@src/types";
import { initialize } from "@src/startup";
import { IEventBus, Logger } from "@filecoin-plus/core";
import { InversifyExpressServer } from "inversify-express-utils";
import { errorHandler } from "./http/middlewares/error-handler";
import { corsMiddleware } from "./http/middlewares/cors-middleware";
import {
  subscribeApplicationSubmissions,
  subscribeGovernanceReviews,
  subscribeRKHApprovals,
  subscribeDatacapAllocations,
} from "@src/worker";
import { Db } from "mongodb";

async function main() {
  // Initialize the container
  const container = await initialize();

  // Get the logger from the container
  const logger = container.get<Logger>(TYPES.Logger);

  // Initialize and configure the API server
  const server = new InversifyExpressServer(container);
  server.setConfig((app: Application) => {
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(corsMiddleware);
  });
  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  // Bind the API server to the container
  const apiServer = server.build();
  container.bind<Application>(TYPES.ApiServer).toConstantValue(apiServer);

  // Initialize RabbitMQ as subscribe to events
  const eventBus = container.get<IEventBus>(TYPES.EventBus);
  try {
    // TODO: needed for RabbitMQ await eventBus.init();
    await eventBus.subscribeEvents();
    logger.info("Event bus initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize event bus ", { error });
    process.exit(1);
  }

  // Nuke the database
  const db = await container.get<Db>(TYPES.Db);
  await db.collection("airtable-client:records").deleteMany({});
  await db.collection("airtable-client:records").deleteMany({});
  await db.collection("datacapAllocators").deleteMany({});

  // Start worker services
  // TODO: Move this to application startup
  await subscribeApplicationSubmissions(container);
  await subscribeGovernanceReviews(container);
  await subscribeRKHApprovals(container);
  await subscribeDatacapAllocations(container);

  // Start the API server
  apiServer.listen(config.API_PORT, () =>
    console.log(
      "The application is initialised on the port %s",
      config.API_PORT
    )
  );
}

main().catch((error) => {
  console.error("Unhandled error while starting the application:", error);
  process.exit(1);
});
