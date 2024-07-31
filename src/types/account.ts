export interface Account {
  address: string
  isConnected: boolean
  connector: 'wagmi' | 'ledger'
}