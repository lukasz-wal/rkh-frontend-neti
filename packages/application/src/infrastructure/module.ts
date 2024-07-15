import { ICommandBus, IEventBus, IQueryBus } from "@filecoin-plus/core";
import { AsyncContainerModule, interfaces } from "inversify";
import { Db } from "mongodb";

import { TYPES } from "@src/types";
import { CommandBus } from "./command-bus";

import { DatacapAllocatorEventStore } from "@src/infrastructure/event-store/datacap-allocator-event-store";
import { DatacapAllocatorRepository } from "@src/infrastructure/respositories/datacap-allocator-repository";
import {
  IDatacapAllocatorEventStore,
  IDatacapAllocatorRepository,
} from "@src/domain/datacap-allocator";
import config from "@src/config";
import { createMongodbConnection } from "./db/mongodb";
import {
  RabbitMQConfig,
  RabbitMQEventBus,
} from "./event-bus/rabbitmq-event-bus";
import { QueryBus } from "./query-bus";
import {
  GithubClient,
  GithubClientConfig,
  IGithubClient,
} from "./clients/github";
import {
  AirtableClient,
  AirtableClientConfig,
  IAirtableClient,
} from "./clients/airtable";
import { ILotusClient, LotusClient, LotusClientConfig } from "./clients/lotus";

export const infrastructureModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    // MongoDB setup
    const db: Db = await createMongodbConnection(
      config.MONGODB_URI,
      config.DB_NAME
    );
    bind<Db>(TYPES.Db).toConstantValue(db);

    // RabbitMQ configuration
    const rabbitMQConfig: RabbitMQConfig = {
      url: config.RABBITMQ_URL,
      username: config.RABBITMQ_USERNAME,
      password: config.RABBITMQ_PASSWORD,
      exchangeName: config.RABBITMQ_EXCHANGE_NAME,
      exchangeType: config.RABBITMQ_EXCHANGE_TYPE,
      queueName: config.RABBITMQ_QUEUE_NAME,
    };
    bind<RabbitMQConfig>(TYPES.RabbitMQConfig).toConstantValue(rabbitMQConfig);
    bind<IEventBus>(TYPES.EventBus).to(RabbitMQEventBus).inSingletonScope();

    // GitHub client configuration
    const githubClientConfig: GithubClientConfig = {
      authToken: config.GITHUB_AUTH_TOKEN,
    };
    bind<GithubClientConfig>(TYPES.GithubClientConfig).toConstantValue(
      githubClientConfig
    );
    bind<IGithubClient>(TYPES.GithubClient).to(GithubClient).inSingletonScope();

    // Airtable client configuration
    const airtableClientConfig: AirtableClientConfig = {
      apiKey: config.AIRTABLE_API_KEY,
      baseId: config.AIRTABLE_BASE_ID,
      tableName: config.AIRTABLE_TABLE_NAME,
    };
    bind<AirtableClientConfig>(TYPES.AirtableClientConfig).toConstantValue(
      airtableClientConfig
    );
    bind<IAirtableClient>(TYPES.AirtableClient).to(AirtableClient);

    // Lotus client configuration
    const lotusClientConfig: LotusClientConfig = {
      rpcUrl: config.LOTUS_RPC_URL,
      authToken: config.LOTUS_AUTH_TOKEN,
    };
    bind<LotusClientConfig>(TYPES.LotusClientConfig).toConstantValue(
      lotusClientConfig
    );
    bind<ILotusClient>(TYPES.LotusClient).to(LotusClient);

    // Bindings
    bind<IDatacapAllocatorEventStore>(TYPES.DatacapAllocatorEventStore)
      .to(DatacapAllocatorEventStore)
      .inSingletonScope();
    bind<IDatacapAllocatorRepository>(TYPES.DatacapAllocatorRepository)
      .to(DatacapAllocatorRepository)
      .inSingletonScope();
    bind<ICommandBus>(TYPES.CommandBus).toConstantValue(new CommandBus());
    bind<IQueryBus>(TYPES.QueryBus).toConstantValue(new QueryBus());
  }
);
