import { Application } from "@/types/application";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CopyIcon, GitBranch, MoreHorizontal } from "lucide-react";
import SignTransactionButton from "../SignTransactionButton";
import Link from "next/link";
import { useAccount } from "@/hooks/useAccount";
import { useToast } from "../ui/use-toast";
import { AccountRole } from "@/types/account";

interface DashboardApplicationsPanelProps {
  applications: Application[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function DashboardApplicationsPanel({
  applications,
  totalCount,
  currentPage,
  pageSize,
}: DashboardApplicationsPanelProps) {
  const { account } = useAccount();
  const { toast } = useToast();

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalCount);

  function renderActionButton(application: Application) {
    if (!account?.isConnected) {
      return <Button disabled>Connect Wallet</Button>;
    }

    switch (application.status.phase) {
      case "SUBMISSION":
        return (
          <Button>
            <Link
              href={`https://github.com/threesigmaxyz/Allocator-Registry/pull/${application.phases.submission.pullRequestNumber}`}
              target="_blank"
            >
              View
            </Link>
          </Button>
        );

      case "KYC":
        return (
          <Button disabled={account?.role !== AccountRole.USER}>
            <Link
              href={`https://flow-dev.togggle.io/fidl/kyc?q=${application.id}`}
              target="_blank"
            >
              Submit KYC
            </Link>
          </Button>
        );

      case "GOVERNANCE_REVIEW":
        return (
          <Button disabled={account?.role !== AccountRole.GOVERNANCE_TEAM}>
            <Link
              href={`https://github.com/threesigmaxyz/Allocator-Registry/pull/${application.phases.submission.pullRequestNumber}`}
              target="_blank"
            >
              Review
            </Link>
          </Button>
        );

      case "RKH_APPROVAL":
        if (account?.role !== AccountRole.ROOT_KEY_HOLDER) {
          return <Button disabled>Approve</Button>;
        }
        return (
          <SignTransactionButton application={application} text="Approve" />
        );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>
          Consult and manage Fil+ program applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Country</TableHead>
              <TableHead className="hidden md:table-cell">DataCap</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => {
              return (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.number}
                  </TableCell>
                  <TableCell>{application.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {application.country}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {application.datacap} PB
                  </TableCell>
                  <TableCell>
                    <Badge>{application.status.phase}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">
                      {application.status.phaseStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{renderActionButton(application)}</TableCell>
                  <TableCell className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        {application.phases?.submission?.pullRequestUrl && (
                          <DropdownMenuItem>
                            <Link
                              href={`https://github.com/threesigmaxyz/Allocator-Registry/pull/${application.phases.submission.pullRequestNumber}`}
                              target="_blank"
                            >
                              Open PR
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <CopyIcon
                      className="h-4 w-4 ml-2"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(application.id);
                          toast({
                            title: "Application ID copied",
                            description:
                              "The application ID has been copied to the clipboard.",
                          });
                        } catch (err) {
                          console.error("Failed to copy text: ", err);
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing{" "}
          <strong>
            {startIndex}-{endIndex}
          </strong>{" "}
          of <strong>{totalCount}</strong> applications
        </div>
      </CardFooter>
    </Card>
  );
}
