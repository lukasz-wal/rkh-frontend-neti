"use client";

import React, { useEffect, useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useSignTypedData } from "wagmi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from "@/hooks/useAccount";

export default function SignTransactionButton({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  const { account } = useAccount();
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
          <ScaleLoader />
        </div>
        <button
          onClick={() =>
            signTypedData({
              types: {
                Person: [
                  { name: "name", type: "string" },
                  { name: "wallet", type: "address" },
                ],
                Mail: [
                  { name: "from", type: "Person" },
                  { name: "to", type: "Person" },
                  { name: "contents", type: "string" },
                ],
              },
              primaryType: "Mail",
              message: {
                from: {
                  name: "Cow",
                  wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
                },
                to: {
                  name: "Bob",
                  wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                },
                contents: "Hello, Bob!",
              },
            })
          }
        >
          Sign message
        </button>
        data: {JSON.stringify(data)}
      </DialogContent>
    </Dialog>
  );
}
