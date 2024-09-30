export interface Wallet {
    type: string;
    sign: (message: any) => Promise<string>;
    getAccounts: () => Promise<string[]>;
}