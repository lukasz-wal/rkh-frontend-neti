"use client";

import { useEffect, useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ExternalLink } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from "@/hooks";
import { Application } from "@/types/application";
import { env } from "@/config/environment";

interface SignMetaAllocatorTransactionButtonProps {
    application: Application;
}

export default function SignMetaAllocatorTransactionButton({ application }: SignMetaAllocatorTransactionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    const { account } = useAccount();
    const { toast } = useToast();

    const { writeContract, isPending, error: isError, data: hash, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
    })

    const handleOpenChange = (open: boolean) => {
        reset();
        setIsOpen(open);
    };

    useEffect(() => {
        if (isConfirming) {
            toast({
                title: "Transaction submitted",
                description: `${hash}`,
                variant: "default",
            });
            handleOpenChange(false);
        }

        if (isError) {
            toast({
                title: "Error",
                description: "Failed to submit transaction",
                variant: "destructive",
            });
            handleOpenChange(false);
        }
    }, [isError, isConfirming]);

    const addVerifier = async (verifierAddress: string, datacap: string) => {
        writeContract({
            address: env.metaAllocatorContractAddress as `0x${string}`,
            abi: [{
                "type": "function",
                "name": "addAllowance",
                "inputs": [
                {
                    "name": "allocator",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            }],
            functionName: "addAllowance",
            args: [
                verifierAddress as `0x${string}`,
                BigInt(datacap)
            ],
        });
    };

    const submitTransaction = async () => {
        await addVerifier(application.address, application.datacap);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <Button
                className="w-[150px]"
                disabled={!account?.isConnected || isPending}
                onClick={() => setIsOpen(true)}
            >
                Approve
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign Transaction</DialogTitle>
                    <DialogDescription>
                        Signing a transaction to set meta allocator allowance.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex justify-center items-center p-8">
                    {isPending && <ScaleLoader />}
                    {isConfirming && <p>Confirming transaction...</p>}
                    {isConfirmed && <p>Transaction confirmed!</p>}

                    {!isPending && (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Field</TableHead>
                            <TableHead>Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="to">
                                <TableCell>{"To"}</TableCell>
                                <TableCell>
                                    {env.metaAllocatorContractAddress.slice(0, 6)}...{env.metaAllocatorContractAddress.slice(-4)}
                                    <a
                                    href={`https://filscan.io/en/address/${env.metaAllocatorContractAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 inline-block align-middle"
                                    >
                                    <ExternalLink size={16} />
                                    </a>
                                </TableCell>
                            </TableRow>
                            <TableRow key="verifier">
                                <TableCell>{"Verifier"}</TableCell>
                                <TableCell>
                                    {application.address.slice(0, 6)}...{application.address.slice(-4)}
                                    <a
                                    href={`https://filscan.io/en/address/${application.address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 inline-block align-middle"
                                    >
                                    <ExternalLink size={16} />
                                    </a>
                                </TableCell>
                            </TableRow>
                                <TableRow key="datacap">
                                <TableCell>{"DataCap"}</TableCell>
                                <TableCell>{application.datacap} PiB</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    )}
                </div>

                <div className="flex justify-center">
                    <Button className="w-[150px]" disabled={isPending} onClick={submitTransaction}>
                        {isPending ? "Submitting..." : "Submit"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}