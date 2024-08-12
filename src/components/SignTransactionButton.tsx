"use client";

import React, { useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useSignTypedData } from "wagmi";

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
import { VerifyAPI } from "@keyko-io/filecoin-verifier-tools";

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
  const { account } = useAccount();
  const { toast } = useToast();

  // Function to sign a transaction

  const { data, isPending, isError, isSuccess, signTypedData } =
    useSignTypedData({
      mutation: {
        onError: (error) => {
          alert("onError");
        },
        onSuccess: (data) => {
          setIsOpen(false);
          toast({
            title: "✅ Success",
            description: "Transaction signed successfully.",
          });
        },
      },
    });

  const signTransaction = async () => {
    // const signer = await WebAssembly.instantiate(FilecoinSigner);
    // console.log(signer);

    // Ledger wallet implementation
    const ledgerWallet: Wallet = {
      getAccounts: async () => {
        return ["f1utmsqqeigfrvup3jrhy3gwlffi6aganuh2gu4tq"];
      },
      sign: async (message) => {
        // const serializedMessage = signer.exports.transactionSerialize(message)
        // alert(serializedMessage);

        return {}
      },
    };

    const api = new VerifyAPI(
      VerifyAPI.browserProvider("https://api.node.glif.io/rpc/v1", {
        token: async () => {
          return "UXggx8DyJeaIIIe1cJZdnDk4sIiTc0uF3vYJXlRsZEQ=";
        },
      }),
      ledgerWallet,
      true
    );

    // alert(application.address);
    // const messageId = await api.multisigVerifyClient(
    //   "f080",
    //   application.address,
    //   BigInt(application.datacap),
    //   0,
    //   ledgerWallet
    // );
    // alert(messageId);
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
              <TableCaption>Payload: ...</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key="address">
                  <TableCell>{"Address"}</TableCell>
                  <TableCell>{application.address}</TableCell>
                </TableRow>
                <TableRow key="datacap">
                  <TableCell>{"DataCap"}</TableCell>
                  <TableCell>{application.datacap} PB</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
        <Button disabled={isPending} onClick={() => signTransaction()}>
          {isPending ? <ScaleLoader color="#fff" /> : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
