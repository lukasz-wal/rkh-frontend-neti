"use client";

import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { useDisconnect } from "wagmi";

type ConnectionMethod = "wagmi" | "ledger";

const ConnectionStages = {
  wagmi: ["Initializing", "Connecting", "Confirming"],
  ledger: ["Initializing", "Waiting for Device", "Confirming Address"],
};

export default function ConnectWalletButton() {
  const { account, connect } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [connectionMethod, setConnectionMethod] =
    useState<ConnectionMethod | null>(null);
  const [stage, setStage] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const { disconnect: wagmiDisconnect } = useDisconnect();

  const handleConnect = async (method: ConnectionMethod) => {
    setConnectionMethod(method);
    setIsConnecting(true);
    setStage(0);

    try {
      // for (let i = 0; i < ConnectionStages[method].length; i++) {
      //   setStage(i)
      //   // Simulate each stage taking some time
      //   await new Promise(resolve => setTimeout(resolve, 1000))
      // }

      await connect(method);
      // toast({
      //   title: "Wallet Connected",
      //   description: "Your wallet has been successfully connected.",
      // });
      setIsOpen(false);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description:
          "There was an error connecting your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
      setConnectionMethod(null);
      setStage(0);
    }
  };

  if (account) {
    return (
      <Button onClick={() => wagmiDisconnect()}>
        Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>Login</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a method to connect your wallet.
          </DialogDescription>
        </DialogHeader>
        {!connectionMethod ? (
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => handleConnect("wagmi")}
              disabled={isConnecting}
            >
              Connect with Metamask
            </Button>
            <Button
              onClick={() => handleConnect("ledger")}
              disabled={isConnecting}
            >
              Connect with Ledger
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>{ConnectionStages[connectionMethod][stage]}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
