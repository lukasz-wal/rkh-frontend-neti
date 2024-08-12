export enum AccountRole {
  GUEST = "GUEST",
  APPLICANT = "APPLICANT",
  GOVERNANCE_MEMBER = "GOVERNANCE_MEMBER",
  ROOT_KEY_HOLDER = "ROOT_KEY_HOLDER",
}

export interface Account {
  address: string
  isConnected: boolean
  connector: 'wagmi' | 'ledger'
  role: AccountRole
}