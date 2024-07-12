import { IEventHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";
import { Db } from "mongodb";

import { GovernanceReviewApproved, GovernanceReviewRejected, GovernanceReviewStarted, KYCApproved, KYCRejected, KYCStarted } from "@src/domain/events";
import { CommandBus } from "@src/infrastructure/command-bus";
import { TYPES } from "@src/types";
import { UpdateApplicationPullRequestCommand } from "@src/application/commands/definitions/update-application-pr";
import {
  DatacapAllocatorPhase,
  DatacapAllocatorPhaseStatus,
} from "@src/domain/datacap-allocator";

@injectable()
export class KYCStartedEventHandler implements IEventHandler<KYCStarted> {
  public event = KYCStarted.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: KYCStarted): Promise<void> {
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
      new UpdateApplicationPullRequestCommand(event.aggregateId)
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
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateApplicationPullRequestCommand(event.aggregateId)
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
        },
      }
    );

    const result = await this._commandBus.send(
      new UpdateApplicationPullRequestCommand(event.aggregateId)
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
      new UpdateApplicationPullRequestCommand(event.aggregateId)
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
      new UpdateApplicationPullRequestCommand(event.aggregateId)
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
      new UpdateApplicationPullRequestCommand(event.aggregateId)
    );
  }
}