import { AsyncContainerModule } from "inversify";
import { TYPES } from "../types.js";
import { CommandBus } from "./command-bus/index.js";
import { DatacapAllocatorEventStore } from "../infrastructure/event-store/datacap-allocator-event-store.js";
import { DatacapAllocatorRepository } from "../infrastructure/respositories/datacap-allocator-repository.js";
import config from "../config.js";
import { createMongodbConnection } from "./db/mongodb.js";
import { RabbitMQEventBus, } from "./event-bus/rabbitmq-event-bus.js";
import { QueryBus } from "./query-bus/index.js";
import { GithubClient, } from "./clients/github.js";
import { AirtableClient, } from "./clients/airtable.js";
export const infrastructureModule = new AsyncContainerModule(async (bind) => {
    // MongoDB setup
    const db = await createMongodbConnection(config.MONGODB_URI, config.DB_NAME);
    bind(TYPES.Db).toConstantValue(db);
    // RabbitMQ configuration
    const rabbitMQConfig = {
        url: config.RABBITMQ_URL,
        username: config.RABBITMQ_USERNAME,
        password: config.RABBITMQ_PASSWORD,
        exchangeName: config.RABBITMQ_EXCHANGE_NAME,
        exchangeType: config.RABBITMQ_EXCHANGE_TYPE,
        queueName: config.RABBITMQ_QUEUE_NAME,
    };
    bind(TYPES.RabbitMQConfig).toConstantValue(rabbitMQConfig);
    bind(TYPES.EventBus).to(RabbitMQEventBus).inSingletonScope();
    // GitHub client configuration
    const githubClientConfig = {
        authToken: config.GITHUB_AUTH_TOKEN,
    };
    bind(TYPES.GithubClientConfig).toConstantValue(githubClientConfig);
    bind(TYPES.GithubClient).to(GithubClient).inSingletonScope();
    // Airtable client configuration
    const airtableClientConfig = {
        apiKey: config.AIRTABLE_API_KEY,
        baseId: config.AIRTABLE_BASE_ID,
        tableName: config.AIRTABLE_TABLE_NAME,
    };
    bind(TYPES.AirtableClientConfig).toConstantValue(airtableClientConfig);
    bind(TYPES.AirtableClient).to(AirtableClient);
    // Bindings
    bind(TYPES.DatacapAllocatorEventStore)
        .to(DatacapAllocatorEventStore)
        .inSingletonScope();
    bind(TYPES.DatacapAllocatorRepository)
        .to(DatacapAllocatorRepository)
        .inSingletonScope();
    bind(TYPES.CommandBus).toConstantValue(new CommandBus());
    bind(TYPES.QueryBus).toConstantValue(new QueryBus());
});
