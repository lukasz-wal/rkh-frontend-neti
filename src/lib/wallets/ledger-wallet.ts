// @ts-ignore
import FilecoinApp from "@zondax/ledger-filecoin";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { Wallet } from "@/types/wallet";


interface LedgerAccount {
    address: string;
    index: number;
    path: string;
}

export class LedgerWallet implements Wallet {
    type = "ledger";

    private filecoinApp: FilecoinApp;
    private address: string;

    constructor(filecoinApp: FilecoinApp, address: string) {
        this.filecoinApp = filecoinApp;
        this.address = address;
    }

    async sign(message: any): Promise<string> {
        const { signature } = await this.filecoinApp.sign(this.address, message);
        return signature;
    }

    async getAccounts(): Promise<string[]> {
        const accounts: LedgerAccount[] = [];
        for (let i = 0; i < 5; i++) {
            const path = `m/44'/461'/0'/0/${i}`;
            const { addrString } = await this.filecoinApp.getAddressAndPubKey(path);
            accounts.push({ address: addrString, index: i, path });
        }
        
        return accounts.map((account) => account.address);
    }
}