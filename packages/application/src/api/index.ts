import * as dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import '@src/api/http/controllers/index.js';

import { Application, urlencoded, json } from "express";

import config from "@src/config";
import { TYPES } from "@src/types";
import { initialize } from "@src/startup";
import { IEventBus } from "@filecoin-plus/core";
import { RabbitMQEventBus } from "@src/infrastructure/event-bus/rabbitmq-event-bus";
import { InversifyExpressServer } from "inversify-express-utils";
import { errorHandler } from "./http/middlewares/error-handler";
import { corsMiddleware } from "./http/middlewares/cors-middleware";


(async () => {
  // Initialize the container
  const container = await initialize();

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
  // TODO: Is this necessary?
  const apiServer = server.build();
  container.bind<Application>(TYPES.ApiServer).toConstantValue(apiServer);

  // Initialize RabbitMQ
  const eventBus = container.get<IEventBus>(TYPES.EventBus) as RabbitMQEventBus;
  await eventBus.init();

  // Subscribe to events
  await eventBus.subscribeEvents();

  apiServer.listen(config.API_PORT, () =>
    console.log(
      "The application is initialised on the port %s",
      config.API_PORT
    )
  );
})();
