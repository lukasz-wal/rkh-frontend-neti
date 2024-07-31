"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  WagmiProvider,
  useAccount as useWagmiAccount,
  useConnect as useWagmiConnect,
  useDisconnect as useWagmiDisconnect,
} from "wagmi";

import { AccountContext } from "@/contexts/AccountContext";
import { wagmiConfig } from "@/lib/wagmi";
import { Account } from "@/types/account";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AccountProviderInner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<Account | null>(null);
  const { address: wagmiAddress, isConnected: wagmiIsConnected } =
    useWagmiAccount();
  const { connect: wagmiConnect, connectors: wagmiConnectors } = useWagmiConnect();
  const { disconnectAsync: wagmiDisconnect } = useWagmiDisconnect();

  useEffect(() => {
    if (wagmiAddress && wagmiIsConnected) {
      setAccount({
        address: wagmiAddress,
        isConnected: true,
        connector: "wagmi",
      });
    } else {
      setAccount(null);
    }
  }, [wagmiAddress, wagmiIsConnected]);

  const connect = useCallback(
    async (connector: "wagmi" | "ledger") => {
      if (connector === "wagmi") {
        wagmiConnect({ connector: wagmiConnectors[0] });
      } else if (connector === "ledger") {
        // const ledgerAddress = await connectLedger();
        // setAccount({
        //   address: ledgerAddress,
        //   isConnected: true,
        //   connector: "ledger",
        // });
      }
    },
    [wagmiConnect]
  );

  const disconnect = useCallback(async () => {
    if (account?.connector === "wagmi") {
      await wagmiDisconnect();
    }
    setAccount(null);
  }, [account, wagmiDisconnect]);

  return (
    <AccountContext.Provider
      value={{
        account,
        connect,
        disconnect,
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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AccountProviderInner>{children}</AccountProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
