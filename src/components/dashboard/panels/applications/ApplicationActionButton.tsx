import { Application } from "@/types/application";
import { Button } from "../../../ui/button";
import Link from "next/link";
import { useAccount } from "@/hooks/useAccount";
import { AccountRole } from "@/types/account";
import SignRkhTransactionButton from "@/components/sign/SignRkhTransactionButton";
import SignMetaAllocatorTransactionButton from "@/components/sign/SignMetaAllocatorTransactionButton";

interface ActionConfig {
  label: string;
  href?: string;
  disabled?: boolean;
  component?: React.ComponentType<any>;
}

function getActionConfig(application: Application, account?: { role: AccountRole }): ActionConfig {
  const { status, id, githubPrNumber } = application;

  switch (status) {
    case "SUBMISSION_PHASE":
    case "GOVERNANCE_REVIEW_PHASE":
      return {
        label: "View",
        href: `https://github.com/filecoin-project/Allocator-Registry/pull/${githubPrNumber}`,
      };

    case "KYC_PHASE":
      return {
        label: "Submit KYC",
        href: `https://flow-dev.togggle.io/fidl/kyc?allocatorId=${id}`,
        disabled: account?.role !== AccountRole.USER,
      };

    case "RKH_APPROVAL_PHASE":
      console.log(application);
      const label = `(${application.rkhApprovals?.length ?? 0}/${application.rkhApprovalsThreshold ?? 2}) Approve`;
      if (account?.role !== AccountRole.ROOT_KEY_HOLDER && account?.role !== AccountRole.ADMIN) {
        return {
          label,
          component: SignRkhTransactionButton,
          // disabled: true,
        };
      }
      return {
        label,
        component: SignRkhTransactionButton,
      };

    case "META_APPROVAL_PHASE":
      return {
        label: "Approve",
        component: SignMetaAllocatorTransactionButton,
        disabled: account?.role ? [AccountRole.ROOT_KEY_HOLDER, AccountRole.ADMIN].includes(account.role) : true,
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