"use client";

import { useEffect } from "react";
import Link from "next/link"
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { useAccount } from "@/hooks/useAccount";

export default function Home() {
  const router = useRouter();
  const { account } = useAccount();

  // Redirect to dashboard is already logged in
  useEffect(() => {
    if (!account?.isConnected) {
      router.push('/dashboard');
    }
  }, [account, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Connect your wallet to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectWalletButton />          
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account? Continue as{" "}
            <Link href="#" className="underline">
              Guest
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
