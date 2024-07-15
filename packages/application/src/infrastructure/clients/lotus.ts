import axios from "axios";
import { inject, injectable } from "inversify";
import { nanoid } from "nanoid";

import { TYPES } from "@src/types";

type PendingTx = {
    id: number;
    to: string;
    method: string;
    params: string;
    value: string;
    approved: string[];
}

type Multisig = {
  address: string;
  threshold: number;
  signers: string[];
  pendingTxs: PendingTx[];
};

export interface ILotusClient {}

export interface LotusClientConfig {
  rpcUrl: string;
  authToken: string;
}

@injectable()
export class LotusClient implements ILotusClient {
  constructor(
    @inject(TYPES.LotusClientConfig)
    private readonly config: LotusClientConfig
  ) {}

  async getMultisig(id: string): Promise<Multisig> {
    const multisigState = await this.request("Filecoin.StateReadState", [
      id,
      null,
    ]);

    const signersIds = multisigState.State.Signers;
    const signers = await Promise.all(
      signersIds.map(async (signerId: string) => {
        return await this.request("Filecoin.StateReadState", [signerId, null]);
      })
    );

    const pendingTxs = await this.request("Filecoin.MsigGetPending", [id, null]);

    return {
      address: id,
      threshold: multisigState.State.NumApprovalsThreshold,
      signers: signers.map((signer) => signer.State.Address),
      pendingTxs: pendingTxs.map((tx: any) => ({
        id: tx.ID,
        to: tx.To,
        method: tx.Method,
        params: tx.Params,
        value: tx.Value,
        approved: tx.Approved,
      })),
    };
  }

  private async request(method: string, params: any[]) {
    const requestBody = JSON.stringify({
      method,
      params,
      id: nanoid(),
      jsonrpc: "2.0",
    });

    const response = await axios.post(this.config.rpcUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${this.config.authToken}`,
        "content-type": "application/json",
      },
    });

    const responseData = response.data;
    if (responseData.error) {
      throw new Error(responseData.error.message);
    }
    if (responseData.result === undefined) {
      throw new Error("Missing result");
    }

    return responseData.result;
  }
}
