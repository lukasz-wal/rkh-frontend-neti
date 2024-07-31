import { Account } from "@/types/account";
import { createContext } from "react";

export interface AccountContextType {
  account: Account | null;
  connect: (connector: "wagmi" | "ledger") => Promise<void>;
  disconnect: () => Promise<void>;
}

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);
