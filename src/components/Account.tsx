"use client";

import { ClipLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useFilsnap } from "@/hooks";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { AccountInfo } from "filsnap-adapter";

interface AccountProps {}

export function Account(props: AccountProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { state, connect } = useFilsnap();

  switch (state.status) {
    case "idle":
      return (
        <>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              //connect();
            }}
          >
            Connect
          </Button>
          <ConnectAccountDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
          />
        </>
      );

    case "loading":
      return (
        <>
          <Button disabled={true}>
            <ClipLoader />
          </Button>
          <ConnectAccountDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
          />
        </>
      );

    case "error":
      return (
        <>
          <Button onClick={() => connect()}>Connect</Button>;
          <ConnectAccountDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
          />
        </>
      );

    case "connected":
      return <AccountProfile account={state.account} />;
  }
}

interface ConnectAccountDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ConnectAccountDialog({
  isOpen,
  setIsOpen,
}: ConnectAccountDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect a Wallet</DialogTitle>
          <DialogDescription>
            Select a method to connect your wallet.
          </DialogDescription>
        </DialogHeader>

        <ConnectAccountForm />

        <DialogFooter>
          <p>
            By connecting a wallet, you agree to Fil+ <a>Terms of Service</a>{" "}
            and consent to its <a>Privacy Policy</a>.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ConnectAccountProvider = {
  id: string;
  title: string;
  icon: any;
};

export function ConnectAccountForm() {
  const { state, connect } = useFilsnap();
  const [selectedProvider, setSelectedProvider] =
    useState<ConnectAccountProvider | null>();

  const providers: ConnectAccountProvider[] = [
    {
      id: "metamask",
      title: "Metamask",
      icon: MailCheck,
    },
    {
      id: "ledger",
      title: "Ledger",
      icon: MailCheck,
    },
  ];

  switch (state.status) {
    case "idle":
      return providers.map((provider) => {
        return (
          <Button
            key={provider.id}
            onClick={() => {
              setSelectedProvider(provider);
              connect();
            }}
            className="flex items-center justify-center gap-2 w-full"
          >
            <span>{provider.title}</span>
            {provider.icon && <provider.icon size={18} />}
          </Button>
        );
      });

    case "loading":
      return (
        <div className="flex items-center justify-center w-full">
          <ClipLoader size={66} />
        </div>
      );

    case "error":
      return (
        <div className="flex items-center justify-center w-full">
          <p>There was an error connecting your wallet.</p>
        </div>
      );

    case "connected":
      return <div>Connected: {state.account.address}</div>;
  }
}

interface AccountProfileProps {
  account: AccountInfo;
}

export function AccountProfile({ account }: AccountProfileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src={`https://avatars.dicebear.com/api/avataaars/${account.address}.svg`}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span>{account.address}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">Wallet:</p>
            {account.address && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                <a
                  href={`https://etherscan.io/address/${account.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {account.address}
                </a>
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            // disconnect();
          }}
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
