import { ICommandBus, Logger } from "@filecoin-plus/core";
import { VerifyAPI } from "@keyko-io/filecoin-verifier-tools";
import { Container } from "inversify";

import { LotusClient } from "@src/infrastructure/clients/lotus";
import { TYPES } from "@src/types";
import { UpdateRKHApprovalsCommand } from "@src/application/commands";

const RHK_MULTISIG_ACTOR_ADDRESS = "f080";
const VERIFIED_REGISTRY_ACTOR_ADDRESS = "f06";
const VERIFIED_REGISTRY_ACTOR_METHODS = {
  ADD_VERIFIER: 2,
};

export async function subscribeRKHApprovals(container: Container) {
  const lotusClient = container.get<LotusClient>(TYPES.LotusClient);
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
  const logger = container.get<Logger>(TYPES.Logger);

  // Initialize the VerifyAPI.
  // TODO: Refactor this into the lotus client.
  const api = new VerifyAPI(
    VerifyAPI.standAloneProvider("https://api.node.glif.io/rpc/v1", {
      token: async () => {
        return "UXggx8DyJeaIIIe1cJZdnDk4sIiTc0uF3vYJXlRsZEQ=";
      },
    }),
    {},
    false // if node != Mainnet => testnet = true
  );

  logger.info("Subscribing to RKH proposals");
  setInterval(async () => {
    const pendingTxs = (
      await api.pendingTransactions(RHK_MULTISIG_ACTOR_ADDRESS)
    )?.filter(
      (tx: any) =>
        tx?.tx.to == VERIFIED_REGISTRY_ACTOR_ADDRESS &&
        tx?.tx.method == VERIFIED_REGISTRY_ACTOR_METHODS.ADD_VERIFIER
    );
    logger.info(`Found ${pendingTxs.length} pending transactions`);

    for (const tx of pendingTxs) {
      await commandBus.send(
        new UpdateRKHApprovalsCommand(
          tx.parsed.params.verifier,
          tx.tx.signers
        )
      );
    }
  }, 5000);
}
