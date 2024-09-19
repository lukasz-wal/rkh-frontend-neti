"use client";

import React, { useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAccount } from "@/hooks/useAccount";
import { Application } from "@/types/application";

interface Wallet {
  getAccounts: () => Promise<string[]>;
  sign: (message: any) => Promise<any>;
}

interface SignTransactionButtonProps {
  application: Application;
  text: string;
}

export default function SignTransactionButton({
  application,
  text,
}: SignTransactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { account, proposeAddVerifier } = useAccount();
  const { toast } = useToast();

  const signTransaction = async () => {
    setIsPending(true);
    try {
      const messageId = await proposeAddVerifier(application.address, application.datacap);
      console.log("messageId", messageId);
    } catch (error) {
      console.error('Error proposing verifier:', error);
      toast({
        title: "Error",
        description: "Failed to propose verifier",
        variant: "destructive",
      });
    }
    setIsPending(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        disabled={!account?.isConnected || isPending}
        onClick={() => setIsOpen(true)}
      >
        {text}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Transaction</DialogTitle>
          <DialogDescription>
            Signing a RKH transaction to add a datacap allocator.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center p-8">
          {isPending && <ScaleLoader />}
          {!isPending && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key="address">
                  <TableCell>{"Address"}</TableCell>
                  <TableCell>{application.address.slice(0, 10)}...{application.address.slice(-10)}</TableCell>
                </TableRow>
                <TableRow key="datacap">
                  <TableCell>{"DataCap"}</TableCell>
                  <TableCell>{application.datacap} PiB</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
        <Button disabled={isPending} onClick={() => signTransaction()}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
