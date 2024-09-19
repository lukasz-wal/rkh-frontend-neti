import { Account } from "@/types/account";
import { createContext } from "react";

export interface LedgerAccount {
  address: string;
  path: string;
  index: number;
}

export interface AccountContextType {
  account: Account | null;
  init: () => Promise<void>;
  connect: (connector: "ledger", index?: number) => Promise<void>;
  disconnect: () => Promise<void>;
  proposeAddVerifier: (verifier: string, datacap: string) => Promise<string>;
  fetchLedgerAccounts: () => Promise<LedgerAccount[]>;
}

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);
