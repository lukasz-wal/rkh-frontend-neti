import * as dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import '../api/http/controllers/index.js';
import { urlencoded, json } from "express";
import config from "../config.js";
import { TYPES } from "../types.js";
import { initialize } from "../startup.js";
import { InversifyExpressServer } from "inversify-express-utils";
import { errorHandler } from "./http/middlewares/error-handler.js";
import { corsMiddleware } from "./http/middlewares/cors-middleware.js";
(async () => {
    // Initialize the container
    const container = await initialize();
    // Initialize and configure the API server
    const server = new InversifyExpressServer(container);
    server.setConfig((app) => {
        app.use(urlencoded({ extended: true }));
        app.use(json());
        app.use(corsMiddleware);
    });
    server.setErrorConfig((app) => {
        app.use(errorHandler);
    });
    // Bind the API server to the container
    // TODO: Is this necessary?
    const apiServer = server.build();
    container.bind(TYPES.ApiServer).toConstantValue(apiServer);
    // Initialize RabbitMQ
    const eventBus = container.get(TYPES.EventBus);
    await eventBus.init();
    // Subscribe to events
    await eventBus.subscribeEvents();
    apiServer.listen(config.API_PORT, () => console.log("The application is initialised on the port %s", config.API_PORT));
})();
