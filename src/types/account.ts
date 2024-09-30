import { Wallet } from "./wallet"

export enum AccountRole {
  GUEST = "GUEST",
  USER = "USER",
  GOVERNANCE_TEAM = "GOVERNANCE_TEAM",
  ROOT_KEY_HOLDER = "ROOT_KEY_HOLDER",
  ADMIN = "ADMIN",
}

export interface Account {
  address: string
  isConnected: boolean
  role: AccountRole
  wallet: Wallet
}
