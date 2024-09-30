// components/ConnectWalletButton.tsx
"use client";

import React, { useState } from "react";
import { useAccount } from "../../hooks/useAccount";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LedgerDialog from "./dialogs/LedgerDialog";
import FilsnapDialog from "./dialogs/FilsnapDialog";

interface ConnectorOption {
  name: string;
  displayName: string;
}

export default function ConnectWalletButton() {
  const { account, disconnect } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [currentConnectorName, setCurrentConnectorName] = useState<string | null>(null);

  const connectorOptions: ConnectorOption[] = [
    { name: "ledger", displayName: "Ledger" },
    { name: "filsnap", displayName: "Metamask" },
    // Add more connectors here
  ];

  const handleClose = () => {
    setIsOpen(false);
    setCurrentConnectorName(null);
  };

  // If an account is connected, display the connected state
  if (account) {
    return (
      <Button onClick={disconnect}>
        Connected: {account.address.slice(0, 6)}...
        {account.address.slice(-4)}
      </Button>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          handleClose();
        }
      }}
    >
      <Button onClick={() => setIsOpen(true)}>Connect Account</Button>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Select Connection Method</DialogTitle>
          <DialogDescription>
            Please choose a method to connect your Filecoin account.
          </DialogDescription>
        </DialogHeader>
        {currentConnectorName === null && (
          <div className="flex flex-col space-y-4">
            {connectorOptions.map((option) => (
              <Button key={option.name} onClick={() => setCurrentConnectorName(option.name)}>
                Connect with {option.displayName}
              </Button>
            ))}
          </div>
        )}
        {currentConnectorName === "ledger" && (
          <LedgerDialog onClose={handleClose} />
        )}
        {currentConnectorName === "filsnap" && (
          <FilsnapDialog onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
