import { createContext } from "react";

type LoadWalletOptionsType = { multisig: boolean, multisigAddress: string }

interface WalletContextType {
    isLogged: boolean;
    isLoading: boolean;
    wallet: string;
    api: any;
    walletIndex: number;
    networkIndex: number;
    accounts: any[];
    accountsActive: any;
    activeAccount: string;
    balance: number;
    message: string;
    multisig: boolean;
    multisigAddress: string;
    multisigID: string;
    sign: (message: any, index: number) => Promise<any>;
    getAccounts: (nStart?: number) => Promise<any>;
    importSeed: (seed: string) => Promise<any>;
    selectNetwork: (network: number) => Promise<any>;
    selectAccount: (index: number) => Promise<any>;
    loadWallet: (type: string, options?: LoadWalletOptionsType) => Promise<boolean>;
    dispatchNotification: (message: string) => void;
    signRemoveDataCap: (message: any, index: number) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | null>(null);
export default WalletContext;