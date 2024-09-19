import { IEventHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";
import { Db } from "mongodb";

import {
  ApplicationSubmitted,
  GovernanceReviewApproved,
  GovernanceReviewRejected,
  GovernanceReviewStarted,
  KYCApproved,
  KYCRejected,
  KYCStarted,
  RKHApprovalCompleted,
  RKHApprovalStarted,
  RKHApprovalsUpdated,
} from "@src/domain/events";
import { CommandBus } from "@src/infrastructure/command-bus";
import { TYPES } from "@src/types";
import {
  DatacapAllocatorPhase,
  DatacapAllocatorPhaseStatus,
} from "@src/domain/datacap-allocator";
import { UpdateGithubBranchCommand } from "@src/application/commands";

@injectable()
export class ApplicationSubmittedEventHandler
  implements IEventHandler<ApplicationSubmitted>
{
  public event = ApplicationSubmitted.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: ApplicationSubmitted): Promise<void> {
    console.log("ApplicationSubmittedEventHandler", event);
    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.KYC,
            phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
          },
          phases: {
            submission: {
              pullRequestUrl: event.prUrl,
              pullRequestNumber: event.prNumber,
              pullRequestCommentId: event.commentId,
              timestamp: event.timestamp,
            },
          },
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}

@injectable()
export class KYCStartedEventHandler implements IEventHandler<KYCStarted> {
  public event = KYCStarted.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: KYCStarted): Promise<void> {
    console.log("KYCStartedEventHandler", event);

    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.KYC,
            phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
          },
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}

@injectable()
export class KYCApprovedEventHandler implements IEventHandler<KYCApproved> {
  public event = KYCApproved.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: KYCApproved): Promise<void> {
    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
            phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
          },
          kycData: event.data,
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}

@injectable()
export class KYCRejectedEventHandler implements IEventHandler<KYCRejected> {
  public event = KYCRejected.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: KYCRejected): Promise<void> {
    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.KYC,
            phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
          },
          kycData: event.data,
        },
      }
    );

    await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}

@injectable()
export class GovernanceReviewStartedEventHandler
  implements IEventHandler<GovernanceReviewStarted>
{
  public event = GovernanceReviewStarted.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: GovernanceReviewStarted): Promise<void> {
    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
            phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
          },
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}

@injectable()
export class GovernanceReviewApprovedEventHandler
  implements IEventHandler<GovernanceReviewApproved>
{
  public event = GovernanceReviewApproved.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: GovernanceReviewApproved): Promise<void> {
    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.RKH_APPROVAL,
            phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
          },
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}

@injectable()
export class GovernanceReviewRejectedEventHandler
  implements IEventHandler<GovernanceReviewRejected>
{
  public event = GovernanceReviewRejected.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: GovernanceReviewRejected): Promise<void> {
    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
            phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
          },
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}

export class RKHApprovalStartedEventHandler implements IEventHandler<RKHApprovalStarted> {
  public event = RKHApprovalStarted.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: RKHApprovalStarted): Promise<void> {
    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.RKH_APPROVAL,
            phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
          },
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}

// TODO: Implement this
// export class RKHApprovalsUpdatedEventHandler implements IEventHandler<RKHApprovalsUpdated> {
//   
// }

@injectable()
export class RKHApprovalCompletedEventHandler
  implements IEventHandler<RKHApprovalCompleted>
{
  public event = RKHApprovalCompleted.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: RKHApprovalCompleted) {
    console.log("RKHApprovalCompletedEventHandler", event);
    // Update allocator status in the database
    await this._db.collection("datacapAllocators").updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: {
            phase: DatacapAllocatorPhase.RKH_APPROVAL,
            phaseStatus: DatacapAllocatorPhaseStatus.COMPLETED,
          },
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(event.aggregateId)
    );
  }
}