"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "../hooks/useAccount";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ChevronLeft, ChevronRight, Copy } from "lucide-react";

const ConnectionStages = [
  "Initializing",
  "Waiting for Device",
  "Fetching Accounts",
  "Select Account",
];

interface LedgerAccount {
  address: string;
  path: string;
  index: number;
}

export default function ConnectWalletButton() {
  const { account, init: initLegder, connect, disconnect, fetchLedgerAccounts } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  const accountsPerPage = 5;

  useEffect(() => {
    if (isOpen) {
      handleConnect();
    }
  }, [isOpen]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setStage(0);

    try {
      setStage(1);
      await initLegder(); // This will initialize the FilecoinApp
      
      setStage(2);
      const accounts = await fetchLedgerAccounts();
      setLedgerAccounts(accounts);

      setStage(3);
    } catch (error) {
      console.error("Connection error:", error);
      // toast({
      //   title: "Connection Failed",
      //   description:
      //     error instanceof Error ? error.message : "An unknown error occurred. Please try again.",
      //   variant: "destructive",
      // });
      setIsConnecting(false);
      setStage(0);
      setIsOpen(false); // Close the dialog on error
    }
  };

  const handleLedgerAccountSelect = async (selectedAccount: LedgerAccount) => {
    try {
      await connect("ledger", selectedAccount.index);
      setIsOpen(false);
    } catch (error) {
      console.error("Ledger connection error:", error);
      toast({
        title: "Connection Failed",
        description:
          "There was an error connecting your Ledger account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
      setStage(0);
      setLedgerAccounts([]);
      setCurrentPage(0);
    }
  };

  const paginatedAccounts = ledgerAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );

  if (account) {
    return (
      <Button onClick={disconnect}>
        Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>Connect Ledger</Button>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Connect Your Ledger</DialogTitle>
          <DialogDescription>
            Please connect your Ledger device and open the Filecoin app.
          </DialogDescription>
        </DialogHeader>
        {stage < 3 ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>{ConnectionStages[stage]}</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Select Ledger Account</h3>
            {paginatedAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-mono text-sm">{account.address}</p>
                  <p className="text-xs text-gray-500">Index: {account.index}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(account.address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleLedgerAccountSelect(account)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      Math.ceil(ledgerAccounts.length / accountsPerPage) - 1,
                      prev + 1
                    )
                  )
                }
                disabled={
                  (currentPage + 1) * accountsPerPage >= ledgerAccounts.length
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
