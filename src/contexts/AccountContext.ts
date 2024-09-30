import { createContext } from "react";

import { Account } from "@/types/account";
import { Connector } from "@/types/connector";

export interface AccountContextType {
  account: Account | null;
  connect: (connectorName: string, options?: any) => Promise<void>;
  disconnect: () => Promise<void>;
  connectors: { [key: string]: Connector };
  proposeAddVerifier: (applicationId: string, verifierAddress: string) => Promise<string>;
  // Add a new method to load the persisted account
  loadPersistedAccount: () => Promise<void>;
}

export const AccountContext = createContext<AccountContextType | undefined>(undefined);
