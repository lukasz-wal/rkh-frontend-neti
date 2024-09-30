/*"use client";

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { VerifyAPI } from "@keyko-io/filecoin-verifier-tools";
// @ts-ignore
import FilecoinApp from "@zondax/ledger-filecoin";
import React, { useState, useCallback, useEffect } from "react";

import { AccountContext } from "@/contexts/AccountContext";
import { Account, AccountRole } from "@/types/account";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchRole } from "@/lib/api";
import { LedgerWallet } from "@/lib/wallets/ledger-wallet";

const queryClient = new QueryClient();

interface LedgerAccount {
  address: string;
  index: number;
  path: string;
}

const AccountProviderInner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [accountIndex, setAccountIndex] = useState<number | null>(null);
  const [transport, setTransport] = useState<any>(null);
  const [filecoinApp, setFilecoinApp] = useState<any>(null);

  const fetchAccountRole = useCallback(
    async (address: string): Promise<AccountRole> => {
      return await fetchRole(address);
    },
    []
  );

  function handleLedgerErrors(response: any) {
    if (
      response.error_message &&
      response.error_message.toLowerCase().includes("no errors")
    ) {
      return response;
    }
    if (
      response.error_message &&
      response.error_message
        .toLowerCase()
        .includes("transporterror: invalid channel")
    ) {
      throw new Error(
        "Lost connection with Ledger. Please unplug and replug device."
      );
    }
    throw new Error(response.error_message);
  }

  const init = useCallback(async () => {
    try {
      const transport = await TransportWebUSB.create();
      const app = new FilecoinApp(transport);
      setTransport(transport);
      setFilecoinApp(app);

      const version = await app.getVersion();
      console.log(version);
      if (version.device_locked) {
        throw new Error("Ledger locked.");
      }
      if (version.test_mode) {
        throw new Error("Filecoin app in test mode.");
      }
      if (version.minor < 18 || (version.minor === 18 && version.patch < 2)) {
        throw new Error("Please update Filecoin app on Ledger.");
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }, []);

  const fetchLedgerAccounts = async (): Promise<LedgerAccount[]> => {
    if (!filecoinApp) {
      await init(); // Try to initialize if not already done
    }
    //if (!filecoinApp) {
    //  throw new Error("Filecoin app is not initialized");
    //}
    const accounts: LedgerAccount[] = [];
    for (let i = 0; i < 5; i++) {
      const path = `m/44'/461'/0'/0/${i}`;
      const { addrString } = await filecoinApp.getAddressAndPubKey(path);
      accounts.push({ address: addrString, index: i, path });
    }
    return accounts;
  }

  const connect = useCallback(
    async (connector: "ledger", options?: { index?: number }) => {
      if (connector === "ledger") {
        try {
          if (!filecoinApp) {
            await init();
          }
          const { addrString: ledgerAddress } = handleLedgerErrors(
            await filecoinApp.getAddressAndPubKey(options?.index ? `m/44'/461'/0'/0/${options.index}` : `m/44'/461'/0'/0/0`)
          );

          const role = await fetchAccountRole(ledgerAddress);
          setAccount({
            address: ledgerAddress,
            isConnected: true,
            role: role,
            wallet: new LedgerWallet(filecoinApp, ledgerAddress),
          });
          setAccountIndex(options?.index ?? 0);
        } catch (e: any) {
          throw new Error(e.message);
        }
      }
    },
    [fetchAccountRole, filecoinApp, init]
  );

  const disconnect = useCallback(async () => {
    if (transport) {
      await transport.close();
    }
    setAccount(null);
    setTransport(null);
    setFilecoinApp(null);
  }, [transport]);

  const proposeAddVerifier = useCallback(async (verifier: string, datacap: string) => {
    if (!filecoinApp || !transport || !account) {
      console.error('Ledger not connected or account not selected');
      return "";
    }

    try {
      const wallet = { 
        sign: async (message: any) => {
          // Implement Ledger signing logic here
          const { signature } = await filecoinApp.sign(account.address, message);
          return signature;
        }, 
        getAccounts: async () => {
          const accounts = await fetchLedgerAccounts();
          return accounts.map((account) => account.address);
        }
      }
      const api = new VerifyAPI(
        VerifyAPI.browserProvider("https://api.node.glif.io/rpc/v1", {
          token: async () => {
            return "UXggx8DyJeaIIIe1cJZdnDk4sIiTc0uF3vYJXlRsZEQ=";
          },
        }),
        wallet,
        false // this.lotusNode.name !== "Mainnet" // if node != Mainnet => testnet = true
      );

      const messageId = await api.proposeVerifier(
        verifier,
        BigInt(datacap),
        accountIndex,
        wallet
      );
      console.log("messageId", messageId);

      return messageId;
    } catch (error) {
      console.error('Error proposing verifier:', error);
      throw error;
    }
  }, [filecoinApp, transport, account, accountIndex]);

  return (
    <AccountContext.Provider
      value={{
        account,
        init,
        connect,
        disconnect,
        proposeAddVerifier,
        fetchLedgerAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AccountProviderInner>{children}</AccountProviderInner>
    </QueryClientProvider>
  );
};
*/