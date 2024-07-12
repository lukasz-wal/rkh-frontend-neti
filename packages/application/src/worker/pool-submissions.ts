import "reflect-metadata";

import { AirtableClient } from "@src/infrastructure/clients/airtable";
import { initialize } from "@src/startup";
import { ICommandBus, IEventBus } from "@filecoin-plus/core";
import { TYPES } from "@src/types";
import { RabbitMQEventBus } from "@src/infrastructure/event-bus/rabbitmq-event-bus";
import { CreateDatacapAllocatorCommand } from "@src/application/commands/definitions/create-datacap-allocator";

(async () => {
  // Init container
  const container = await initialize();

  // Initialize RabbitMQ
  const eventBus = container.get<IEventBus>(TYPES.EventBus) as RabbitMQEventBus;
  await eventBus.init();

  // Get the Airtable client from the container
  const client = container.get<AirtableClient>(TYPES.AirtableClient);

  // Get the command bus from the container
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);

  // Start the application
  setInterval(async () => {
    const newRecords = await client.getTableRecords();
    for (const record of newRecords) {
      console.log("Processing new record", record);
      const result = await commandBus.send(
        new CreateDatacapAllocatorCommand({
          githubUserId: record.fields["Bug ID"]
        })
      );
      console.log("Datacap allocator created successfully", result);
    }
  }, 1000);
})();
