import "reflect-metadata";

import { IEventBus } from "@filecoin-plus/core";
import { decode as cborDecode } from "@ipld/dag-cbor";
import { base64pad } from "multiformats/bases/base64";

import { LotusClient } from "@src/infrastructure/clients/lotus";
import { initialize } from "@src/startup";
import { TYPES } from "@src/types";
import { RabbitMQEventBus } from "@src/infrastructure/event-bus/rabbitmq-event-bus";

const deserializeParams = (base64Params: string) => {
  // Decode from base64
  const decodedParams = Buffer.from(base64Params, "base64");

  // Deserialize the CBOR-encoded buffer
  const msgParams = cborDecode(decodedParams) as any[];

  // // Deserialize individual components
  const recipientAddress = msgParams[0].toString();  // Assuming addressAsBytes is reversible
  console.log(recipientAddress);
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

// https://docs.filecoin.io/basics/the-blockchain/actors#verifiedregistryactor
// https://github.com/filecoin-project/lotus/blob/a57dce31366fdcd5245e3bda762958b49cdec3b1/node/impl/full/state.go#L1401-L1402
// https://github.com/filecoin-project/lotus/blob/a57dce31366fdcd5245e3bda762958b49cdec3b1/cli/multisig.go#L390-L391
(async () => {
  // Init container
  const container = await initialize();

  // Initialize RabbitMQ
  const eventBus = container.get<IEventBus>(TYPES.EventBus) as RabbitMQEventBus;
  await eventBus.init();

  // Get the Lotus client from the container
  const client = container.get<LotusClient>(TYPES.LotusClient);

  // Start the application
  setInterval(async () => {
    const multisig = await client.getMultisig("f080");
    for (const pendingTx of multisig.pendingTxs) {
      console.log(pendingTx.params);
      Buffer.from;
      console.log(deserializeParams(pendingTx.params));
      console.log("---");
    }
    //console.log("Multisig", multisig);
  }, 1000);
})();
