"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import LoginForm from "./LoginForm";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useFilsnap } from "@/hooks/use-filsnap";
import { useRouter } from "next/navigation";

export function LoginDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { state } = useFilsnap();
  const router = useRouter();

  useEffect(() => {
    switch (state.status) {
      case "connected":
        setIsDialogOpen(false);
        router.push("/dashboard");
        // Redirect to dashboard
        
        break;

      case "error":
        setIsDialogOpen(false);
        break;
    }
  }, [state.status]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button onClick={() => setIsDialogOpen(true)}>Login</Button>
        <DialogContent className="sm:max-w-[425px] rounded-none">
          <DialogHeader>
            <DialogTitle>Connect a Wallet</DialogTitle>
            <DialogDescription>
              Select a wallet provider to connect
            </DialogDescription>
          </DialogHeader>

          <LoginForm />

          <DialogFooter>
            <DialogDescription>
              By connecting a wallet, you agree to the <a>Terms of Service</a>{" "}
              and consent to its <a>Privacy Policy</a>.
            </DialogDescription>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
