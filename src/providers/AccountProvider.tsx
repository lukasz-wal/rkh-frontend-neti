"use client";

import React, { useState, useCallback } from "react";

import { AccountContext } from "@/contexts/AccountContext";

import { Connector } from "@/types/connector";
import { LedgerConnector } from "@/lib/connectors/ledger-connector";
import { FilsnapConnector } from "@/lib/connectors/filsnap-connector";
import { Account } from "@/types/account";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VerifyAPI } from "@keyko-io/filecoin-verifier-tools";
import { env } from "@/config/environment";

const queryClient = new QueryClient();

export const AccountProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [currentConnector, setCurrentConnector] = useState<Connector | null>(null);

  // Registry of available connectors
  const connectors: { [key: string]: Connector } = {
    ledger: new LedgerConnector(),
    filsnap: new FilsnapConnector(),
  };

  const loadPersistedAccount = useCallback(async () => {}, [])

  /**
   * Connects using the specified connector.
   * @param connectorName The name of the connector ('ledger' or 'metamask').
   * @param options Optional parameters (e.g., account index for Ledger).
   */
  const connect = useCallback(
    async (connectorName: string, options?: any) => {
      try {
        let connector = connectors[connectorName];

        if (connectorName === "ledger" && options?.accountIndex !== undefined) {
          connector = new LedgerConnector(options.accountIndex);
        }
        const acc = await connector.connect();
        setAccount(acc);
        setCurrentConnector(connector);
      } catch (error) {
        throw error;
      }
    },
    [connectors]
  );

  /**
   * Disconnects the current connector.
   */
  const disconnect = useCallback(async () => {
    if (currentConnector) {
      await currentConnector.disconnect();
      setCurrentConnector(null);
      setAccount(null);
    }
  }, [currentConnector]);

  const proposeAddVerifier = useCallback(async (verifierAddress: string, datacap: string) => {
    if (!account?.wallet) {
      throw new Error("Wallet not connected");
    }

    const api = new VerifyAPI(
      VerifyAPI.browserProvider(env.rpcUrl, {
        token: async () => {
          return env.rpcToken;
        },
      }),
      account.wallet,
      env.useTestData // (false => Mainnet, true => Testnet)
    );

    const dataCap = parseFloat(datacap);
    const fullDataCap = BigInt(dataCap * 1000000000000);
    let verifierAccountId = verifierAddress;
    if (verifierAccountId.length < 12) {
      verifierAccountId = await api.actorKey(verifierAccountId)
    }

    console.log("account", account);
    console.log("account.wallet", account.wallet);
    console.log("verifierAddress", verifierAddress);
    console.log("verifierAccountId", verifierAccountId);
    console.log("fullDataCap", fullDataCap);
    
    const messageId = await api.proposeVerifier(
      verifierAccountId,
      fullDataCap,
      0, // TODO: accountIndex,
      account.wallet
    );
    return messageId;
  }, [currentConnector]);

  const acceptVerifierProposal = useCallback(async (applicationId: string, verifierAddress: string, fromAccount: string, transactionId: string) => {
    if (!account?.wallet) {
      throw new Error("Wallet not connected");
    }

    const api = new VerifyAPI(
      VerifyAPI.browserProvider(env.rpcUrl, {
        token: async () => {
          return env.rpcToken;
        },
      }),
      account.wallet,
      env.useTestData // (false => Mainnet, true => Testnet)
    );

    const messageId = await api.approveVerifier(
      applicationId,
      verifierAddress,
      fromAccount,
      transactionId,
      0,
      account.wallet
    )

    return messageId;
  }, [account]);
  

  return (
    <QueryClientProvider client={queryClient}>
      <AccountContext.Provider
        value={{
          account,
          connect,
          disconnect,
          connectors,
          proposeAddVerifier,
          acceptVerifierProposal,
          loadPersistedAccount,
        }}
      >
        {children}
      </AccountContext.Provider>
    </QueryClientProvider>
    
  );
};
