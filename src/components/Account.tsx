import { Badge } from "@/components/ui/badge";
import { useAccount } from "@/hooks/useAccount";

import AccountDropdown from "./AccountDropdown";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Account() {
  const { account, disconnect } = useAccount();

  return account?.isConnected ? (
    <>
      <Badge variant="outline">{account.role}</Badge>
      <AccountDropdown account={account} onLogout={disconnect} />
    </>
  ) : (
    <ConnectWalletButton />
  );
}
