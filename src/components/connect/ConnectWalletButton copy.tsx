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
import ConnectDialog from "./dialogs/ConnectDialog";

type Step = "select-role" | "select-provider";
type Role = "root" | "meta-allocator";
type Provider = "metamask" | "filsnap" | "ledger";

interface StepConfig {
  title: string;
  description: string;
  canGoBack: boolean;
}

export default function ConnectWalletButton() {
  const { account, disconnect } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
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
        <ConnectDialog onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
