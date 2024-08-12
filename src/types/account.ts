export enum AccountRole {
  GUEST = "GUEST",
  USER = "USER",
  GOVERNANCE_TEAM = "GOVERNANCE_TEAM",
  ROOT_KEY_HOLDER = "ROOT_KEY_HOLDER",
}

export interface Account {
  address: string
  isConnected: boolean
  connector: 'wagmi' | 'ledger'
  role: AccountRole
}