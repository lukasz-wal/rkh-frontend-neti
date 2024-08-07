import { Application, ApplicationStatus } from "@/types/application";
import { Button } from "./ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle, PlusCircle, XCircle } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface ActionConfig {
  label: string;
  icon: React.ElementType;
  action: (id: string) => void;
  disabled: boolean;
}

function getActionConfig(status: ApplicationStatus): ActionConfig {
  switch (status.phaseStatus) {
    case "NOT_STARTED":
      return {
        label: `Start ${status.phase}`,
        icon: XCircle,
        action: async (id: string) => {},
        disabled: false,
      };

    case "IN_PROGRESS":
      return {
        label: `Complete ${status.phase}`,
        icon: AlertCircle,
        action: async (id: string) => {},
        disabled: false,
      };

    case "COMPLETED":
    case "FAILED":
    default:
      return {
        label: `${status.phase} ${status.phaseStatus}`,
        icon: CheckCircle,
        action: () => {},
        disabled: true,
      };
  }
}

export function ApplicationActionButton({
  application,
}: {
  application: Application;
}) {
  const { status, id } = application;
  const { label, icon: Icon, action, disabled } = getActionConfig(status);

  const { toast } = useToast();

  return (
    <>
      <Button
        onClick={async () => {
          action(id);
          toast({
            title: "Success",
          });
        }}
        disabled={disabled}
        variant={disabled ? "outline" : "default"}
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Button>

      <Button variant="outline" size="sm">
        <Link
          href="https://github.com/asynctomatic/Allocator-Registry/pulls"
          rel="noopener noreferrer"
          target="_blank"
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            View
          </span>
        </Link>
      </Button>
    </>
  );
}
