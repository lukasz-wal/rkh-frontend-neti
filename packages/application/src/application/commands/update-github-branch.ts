import { Command, ICommandHandler, Logger } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import config from "@src/config";
import {
  DatacapAllocator,
  DatacapAllocatorPhase,
  DatacapAllocatorPhaseStatus,
  IDatacapAllocatorRepository,
} from "@src/domain/datacap-allocator";
import { IGithubClient, PullRequest } from "@src/infrastructure/clients/github";
import { TYPES } from "@src/types";

export class UpdateGithubBranchCommand extends Command {
  constructor(public readonly allocatorId: string) {
    super();
  }
}

@injectable()
export class UpdateGithubBranchCommandHandler
  implements ICommandHandler<UpdateGithubBranchCommand>
{
  commandToHandle: string = UpdateGithubBranchCommand.name;

  constructor(
    @inject(TYPES.Logger)
    private readonly _logger: Logger,
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository,
    @inject(TYPES.GithubClient) private readonly _githubClient: IGithubClient
  ) {}

  async handle(command: UpdateGithubBranchCommand): Promise<void> {
    console.log(command);
    // Get the allocator from the repository
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with ID ${command.allocatorId} not found`);
    }

    if (
      allocator.status.phase === DatacapAllocatorPhase.GOVERNANCE_REVIEW &&
      allocator.status.phaseStatus === DatacapAllocatorPhaseStatus.IN_PROGRESS
    ) {
      // Add reviewers to the pull request
      await this._githubClient.updatePullRequestReviewers(
        config.GITHUB_OWNER,
        config.GITHUB_REPO,
        allocator.applicationPullRequest.prNumber,
        ["asynctomatic"]
      );
    }

    if (!allocator.applicationPullRequest) {
      // Create a pull request for the allocator
      this._logger.info("Creating new pull request");
      const pullRequest = await this.createPullRequest(allocator);
      this._logger.info(`Pull request created: ${pullRequest.url}`);

      // Comment on the pull request with the status of the application
      this._logger.info("Creating pull request comment");
      const prComment = await this._githubClient.createPullRequestComment(
        config.GITHUB_OWNER,
        config.GITHUB_REPO,
        pullRequest.number,
        this.generateCommentMessage(allocator)
      );
      this._logger.info(`Pull request comment created: ${prComment.id}`);

      // Update the allocator with the pull request information
      allocator.completeSubmission(
        pullRequest.number,
        pullRequest.url,
        prComment.id
      );
      this._repository.save(allocator, allocator.version);
    } else {
      console.log("Updating existing pull request");
      console.log(allocator.status);
      await this.updatePullRequestMessage(allocator);
    }
  }

  private async createPullRequest(
    allocator: DatacapAllocator
  ): Promise<PullRequest> {
    // Create a new branch for the allocator
    const branchName = `filecoin-plus-bot/allocator/${allocator.number}`;
    console.log(`Creating branch ${branchName}`);
    await this._githubClient.createBranch(
      config.GITHUB_OWNER,
      config.GITHUB_REPO,
      branchName,
      "main"
    );
    console.log("Branch created");

    // Create a pull request for the new allocator
    const pullRequest = await this._githubClient.createPullRequest(
      config.GITHUB_OWNER,
      config.GITHUB_REPO,
      `Add new allocator: ${allocator.number}`,
      this.generatePullRequestMessage(allocator),
      branchName,
      "main",
      [
        {
          path: `allocators/${allocator.number}.json`,
          content: JSON.stringify(
            {
              application_number: allocator.number,
              address: allocator.address,
              name: allocator.name,
              organization: allocator.organization,
              location: allocator.country,
              status: "Active",
              metapathway_type: "Automatic",
              associated_org_addresses: allocator.address,
              application: {
                allocations: {
                  standardized: allocator.standardizedAllocations,
                },
                target_clients: allocator.targetClients,
                required_sps: allocator.requiredOperators,
                required_replicas: allocator.requiredReplicas,
                tooling: [],
                data_types: allocator.dataTypes,
                "12m_requested": 10,
                github_handles: [allocator.githubUsername],
                allocation_bookkeeping:
                  "https://github.com/CloudX-Lab/filecion",
              },
              poc: {
                slack: "CloudX Lab",
                github_user: "CloudX-Lab",
              },
              pathway_addresses: {
                msig: "f2o2obeorcnu4zp6zbs6i2pxkzqppxyxommqpsefi",
                signer: ["f1mkrrydd5xdjgtpnlsljkmdy5w3tphzz3orb32di"],
              },
            },
            null,
            2
          ),
        },
      ]
    );
    return pullRequest;
  }

  private async updatePullRequestMessage(allocator: DatacapAllocator) {
    // Update the message on the existing pull request
    await this._githubClient.updatePullRequestComment(
      config.GITHUB_OWNER,
      config.GITHUB_REPO,
      allocator.applicationPullRequest.prNumber,
      allocator.applicationPullRequest.commentId,
      this.generateCommentMessage(allocator)
    );
  }

  /**
   * Generates a formatted pull request message for a Filecoin Plus Allocator application.
   * @param allocator - The DatacapAllocator object containing application details.
   * @returns A formatted markdown string for the pull request message.
   */
  private generatePullRequestMessage(allocator: DatacapAllocator): string {
    const submissionDate = new Date().toISOString().split("T")[0];
    const githubLink = `https://github.com/${allocator.githubUsername}`;

    const message = `
# Filecoin Plus Allocator Application

## Application Details
| Field | Value |
|-------|-------|
| Number | \`${allocator.number}\` |
| Applicant | ${allocator.name} |
| Organization | ${allocator.organization} |
| Address | [${
      allocator.address
    }](https://filfox.info/en/address/${encodeURIComponent(
      allocator.address
    )}) |
| GitHub Username | [![GitHub](https://img.shields.io/badge/GitHub-${
      allocator.githubUsername
    }-181717?style=flat-square&logo=github)](${githubLink}) |
| Country | ${allocator.country} |
| Region | ${allocator.region} |
| Type | \`${allocator.type}\` |
| Submission Date | \`${submissionDate}\` |

---
<sup>This message was automatically generated by the Filecoin Plus Bot. For more information, visit [filecoin.io](https://filecoin.io)</sup>
`;

    return message.trim();
  }

  private generateCommentMessage(allocator: DatacapAllocator): string {
    const statusEmoji = {
      [DatacapAllocatorPhaseStatus.NOT_STARTED]: "⚪",
      [DatacapAllocatorPhaseStatus.IN_PROGRESS]: "🟡",
      [DatacapAllocatorPhaseStatus.COMPLETED]: "🟢",
      [DatacapAllocatorPhaseStatus.FAILED]: "🔴",
    };

    let message = `
## Application Status
${statusEmoji[allocator.status.phaseStatus] || "❓"} \`${
      allocator.status.phase
    }\`

`;

    message += this.getStatusSpecificMessage(allocator);

    message += `
---
<sup>This message was automatically generated by the Filecoin Plus Bot. For more information, visit [filecoin.io](https://filecoin.io)</sup>
`;

    return message;
  }

  private getKYCStatusMessage(allocator: DatacapAllocator): string {
    switch (allocator.status.phaseStatus) {
      case DatacapAllocatorPhaseStatus.NOT_STARTED ||
        DatacapAllocatorPhaseStatus.IN_PROGRESS:
        return `
### Next Steps
1. Complete the KYC process at [our secure portal](https://flow-dev.togggle.io/fidl/kyc?q=${allocator.guid})
2. Your application will be automatically updated once submitted

> ℹ️ KYC completion is required to proceed with your application
`;

      case DatacapAllocatorPhaseStatus.IN_PROGRESS:
        return `
### Next Steps
1. Complete the KYC process at [our secure portal](https://flow-dev.togggle.io/fidl/kyc)
2. Your application will be automatically updated once submitted

> ℹ️ KYC completion is required to proceed with your application
`;
        return `
### Current Status
- Your KYC submission is under review
- We'll update this thread once the process is complete

> ⏳ Thank you for your patience during this process
`;

      case DatacapAllocatorPhaseStatus.COMPLETED:
        return `
### KYC Completed
- Your KYC has been successfully completed
- Your application is now moving to the discussion phase

> ✅ Thank you for your cooperation in this process
`;

      case DatacapAllocatorPhaseStatus.FAILED:
        return `
### KYC Rejected
- We regret to inform you that your KYC submission has been rejected

> ❌ Please contact our support team for more information
`;
    }
  }

  private getDiscussionStatusMessage(
    phaseStatus: DatacapAllocatorPhaseStatus
  ): string {
    switch (phaseStatus) {
      case DatacapAllocatorPhaseStatus.NOT_STARTED:
        return "";

      case DatacapAllocatorPhaseStatus.IN_PROGRESS:
        return `
### Discussion Phase
- Your application is currently under review by the Fil+ governance committee
- Discussion may be required to clarify certain aspects of your application

> 📝 Please be prepared to respond to any questions in this PR
`;

      case DatacapAllocatorPhaseStatus.COMPLETED:
        return `
### Discussion Completed
- The review process for your application has been completed
- Your application is now moving to the approval phase

> 👍 Your application has successfully passed the discussion phase
`;

      case DatacapAllocatorPhaseStatus.FAILED:
        return `
### Discussion Rejected
- We regret to inform you that your application has been rejected

> ❌ Please contact our support team for more information
`;
    }
  }

  private getRKHApprovalStatusMessage(
    status: DatacapAllocatorPhaseStatus
  ): string {
    switch (status) {
      case DatacapAllocatorPhaseStatus.NOT_STARTED:
        return "";
      case DatacapAllocatorPhaseStatus.IN_PROGRESS:
        return `
### Approval Pending
- Your application is awaiting final approval from on-chain signers
- We'll update this thread once a decision has been made

> ⏳ The final decision is pending. Thank you for your patience.
`;
      case DatacapAllocatorPhaseStatus.COMPLETED:
        return `
### Application Approved
- Congratulations! Your application to become a datacap allocator has been approved
- You will receive further instructions shortly

> 🎉 Welcome to the Filecoin Plus community!
`;
      case DatacapAllocatorPhaseStatus.FAILED:
        return `
### Application Rejected
- We regret to inform you that your application has been rejected

> ❌ Please contact our support team for more information
`;
    }
  }

  private getStatusSpecificMessage(allocator: DatacapAllocator): string {
    switch (allocator.status.phase) {
      case DatacapAllocatorPhase.KYC:
        return this.getKYCStatusMessage(allocator);
      case DatacapAllocatorPhase.GOVERNANCE_REVIEW:
        return this.getDiscussionStatusMessage(allocator.status.phaseStatus);
      case DatacapAllocatorPhase.RKH_APPROVAL:
        return this.getRKHApprovalStatusMessage(allocator.status.phaseStatus);
      default:
        return `
### Need Assistance?
- For questions about the application process, please contact our support team

> 📞 We're here to help if you need any assistance
`;
    }
  }
}
