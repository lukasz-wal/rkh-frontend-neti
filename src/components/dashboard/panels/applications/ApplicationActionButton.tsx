import { Application } from "@/types/application";
import { Button } from "../../../ui/button";
import Link from "next/link";
import { useAccount } from "@/hooks/useAccount";
import { AccountRole } from "@/types/account";
import SignTransactionButton from "../../../SignTransactionButton";

interface ActionConfig {
  label: string;
  href?: string;
  disabled?: boolean;
  component?: React.ComponentType<any>;
}

function getActionConfig(application: Application, account?: { role: AccountRole }): ActionConfig {
  const { status, phases, id } = application;

  switch (status.phase) {
    case "SUBMISSION":
    case "GOVERNANCE_REVIEW":
      return {
        label: "View",
        href: `https://github.com/filecoin-project/Allocator-Registry/pull/${phases.submission.pullRequestNumber}`,
      };

    case "KYC":
      return {
        label: "Submit KYC",
        href: `https://flow-dev.togggle.io/fidl/kyc?allocatorId=${id}`,
        disabled: account?.role !== AccountRole.USER,
      };

    case "RKH_APPROVAL":
      if (account?.role !== AccountRole.ROOT_KEY_HOLDER && account?.role !== AccountRole.ADMIN) {
        return {
          label: "(0/2) Approve",
          disabled: true,
        };
      }
      return {
        label: "(0/2) Approve",
        component: SignTransactionButton,
      };

    default:
      return {
        label: "No action",
        disabled: true,
      };
  }
}

export function ApplicationActionButton({ application }: { application: Application }) {
  const { account } = useAccount();
  const { label, href, disabled, component: Component } = getActionConfig(application, { role: account?.role ?? AccountRole.GUEST });

  if (Component) {
    return <Component application={application} text={label} />;
  }

  if (href) {
    return (
      <Button disabled={disabled} className="w-[150px]">
        <Link href={href} target="_blank">
          {label}
        </Link>
      </Button>
    );
  }

  return <Button disabled={disabled}>{label}</Button>;
}