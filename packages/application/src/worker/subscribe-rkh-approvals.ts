import { ICommandBus } from "@filecoin-plus/core";
import { Container } from "inversify";

import { LotusClient } from "@src/infrastructure/clients/lotus";
import { TYPES } from "@src/types";

export async function subscribeRkhApprovals(container: Container) {
  // Get the Lotus client from the container
  const lotusClient = container.get<LotusClient>(TYPES.LotusClient);

  // Get the command bus from the container
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);

  setInterval(async () => {
    // TODO
  });
}
