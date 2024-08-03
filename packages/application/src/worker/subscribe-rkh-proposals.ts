import { ICommandBus } from "@filecoin-plus/core";
import { decode as cborDecode } from "@ipld/dag-cbor";

import { LotusClient } from "@src/infrastructure/clients/lotus";
import { TYPES } from "@src/types";
import { UpdateRKHApprovalsCommand } from "@src/application/commands/update-rkh-approvals";
import { Container } from "inversify";

const VERIFIED_REGISTRY_ACTOR_ADDRESS = "f06";
const VERIFIED_REGISTRY_ACTOR_METHODS = {
  ADD_VERIFIER: 2,
};

// https://docs.filecoin.io/basics/the-blockchain/actors#verifiedregistryactor
// https://github.com/filecoin-project/lotus/blob/a57dce31366fdcd5245e3bda762958b49cdec3b1/node/impl/full/state.go#L1401-L1402
// https://github.com/filecoin-project/lotus/blob/a57dce31366fdcd5245e3bda762958b49cdec3b1/cli/multisig.go#L390-L391
export async function subscribeRkhProposals(container: Container) {
  // Get the Lotus client from the container
  const client = container.get<LotusClient>(TYPES.LotusClient);

  // Get the command bus from the container
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);

  // Start the application
  setInterval(async () => {
    const multisig = await client.getMultisig("f080");
    // console.log("Multisig", multisig);

    for (const pendingTx of multisig.pendingTxs) {
      if (
        pendingTx.to === VERIFIED_REGISTRY_ACTOR_ADDRESS &&
        pendingTx.method === VERIFIED_REGISTRY_ACTOR_METHODS.ADD_VERIFIER
      ) {
        console.log("PendingTx", pendingTx);
        // console.log("PendingTx", pendingTx);
        const params = deserializeParams(pendingTx.params);
        const address = Array.from(params[0])
          .map((byte: any) => byte.toString(16).padStart(2, "0"))
          .join("");
        // const value = params[1];

        const result = await commandBus.send(
          new UpdateRKHApprovalsCommand(
            pendingTx.id,
            address,
            pendingTx.approved.map((a) => a.toString())
          )
        );
      }
    }
    //console.log("Multisig", multisig);
    console.log("-".repeat(50));
  }, 5000);
}

const deserializeParams = (base64Params: string) => {
  // Decode from base64
  const decodedParams = Buffer.from(base64Params, "base64");
  // console.log("decodedParams", decodedParams);
  // console.log("decodedParams.toString()", decodedParams.toString());

  // Deserialize the CBOR-encoded buffer
  const msgParams = cborDecode(decodedParams) as any[];
  console.log("msgParams", msgParams);

  // // Deserialize individual components
  const recipientAddress = msgParams[0].toString(); // Assuming addressAsBytes is reversible
  console.log("recipientAddress", recipientAddress);
  // const value = deserializeBigNum(msgParams[1]);     // Assuming you have deserializeBigNum function
  // const method = msgParams[2];
  // const params = cbor.util.deserialize(msgParams[3]);

  return msgParams;
  // return {
  //     recipientAddress,
  //     value: value.toString(),
  //     method,
  //     params
  // };
};
