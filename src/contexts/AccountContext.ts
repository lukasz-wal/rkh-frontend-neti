import { createContext } from "react";

import { Account } from "@/types/account";
import { Connector } from "@/types/connector";

export interface AccountContextType {
  account: Account | null;
  connect: (connectorName: string, accountIndex?: number) => Promise<void>;
  disconnect: () => Promise<void>;
  connectors: { [key: string]: Connector };
  proposeAddVerifier: (verifierAddress: string, datacap: string) => Promise<string>;
  acceptVerifierProposal: (verifierAddress: string, datacap: string, fromAccount: string, transactionId: number) => Promise<string>;
  // Add a new method to load the persisted account
  loadPersistedAccount: () => Promise<void>;
}

export const AccountContext = createContext<AccountContextType | undefined>(undefined);
