import { ICommandBus, Logger } from "@filecoin-plus/core";
import { Container } from "inversify";

import { UpdateDatacapAllocationCommand } from "@src/application/commands";
import { ILotusClient } from "@src/infrastructure/clients/lotus";
import { TYPES } from "@src/types";

export async function subscribeDatacapAllocations(container: Container) {
  const lotusClient = container.get<ILotusClient>(TYPES.LotusClient);
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
  const logger = container.get<Logger>(TYPES.Logger);

  logger.info("Subscribing to datacap allocations");
  setInterval(async () => {
    const datacapAllocations = await lotusClient.getDatacapAllocations();
    logger.info(`Found ${datacapAllocations.length} datacap allocations`);

    for (const datacapAllocation of datacapAllocations) {
      await commandBus.send(
        new UpdateDatacapAllocationCommand(
         datacapAllocation.allocatorId,
          datacapAllocation.datacap)
      );
      break;
    }
  }, 5000);
}
