import { IEventHandler } from '@filecoin-plus/core'
import { inject, injectable } from 'inversify'
import { Db } from 'mongodb'

import {
  AllocatorMultisigUpdated,
  ApplicationEdited,
  ApplicationPullRequestUpdated,
  DatacapAllocationUpdated,
  GovernanceReviewApproved,
  GovernanceReviewRejected,
  GovernanceReviewStarted,
  KYCApproved,
  KYCRejected,
  KYCStarted,
  RKHApprovalCompleted,
  RKHApprovalStarted,
  RKHApprovalsUpdated,
} from '@src/domain/application/application.events'
import { TYPES } from '@src/types'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import { ApplicationStatus } from '@src/domain/application/application'

@injectable()
export class ApplicationEditedEventHandler implements IEventHandler<ApplicationEdited> {
  public event = ApplicationEdited.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: ApplicationEdited): Promise<void> {
    await this._repository.update({
      id: event.aggregateId,
      number: event.applicationNumber,
      name: event.applicantName,
      organization: event.applicantOrgName,
      address: event.applicantAddress,
      github: event.applicantGithubHandle,
      location: event.applicantLocation,
    })
  }
}

@injectable()
export class ApplicationPullRequestUpdatedEventHandler implements IEventHandler<ApplicationPullRequestUpdated> {
  public event = ApplicationPullRequestUpdated.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: ApplicationPullRequestUpdated): Promise<void> {
    await this._repository.update({
      id: event.aggregateId,
      status: ApplicationStatus.KYC_PHASE,
      applicationDetails: {
        pullRequestUrl: event.prUrl,
        pullRequestNumber: event.prNumber,
      },
    })
  }
}

@injectable()
export class AllocatorMultisigUpdatedEventHandler implements IEventHandler<AllocatorMultisigUpdated> {
  public event = AllocatorMultisigUpdated.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: AllocatorMultisigUpdated): Promise<void> {
    await this._repository.update({
      id: event.aggregateId,
      actorId: event.allocatorActorId,
      address: event.multisigAddress,
    })
  }
}
@injectable()
export class KYCStartedEventHandler implements IEventHandler<KYCStarted> {
  public event = KYCStarted.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: KYCStarted): Promise<void> {
    this._repository.update({
      id: event.aggregateId,
      status: ApplicationStatus.KYC_PHASE,
    })
  }
}

@injectable()
export class KYCApprovedEventHandler implements IEventHandler<KYCApproved> {
  public event = KYCApproved.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: KYCApproved): Promise<void> {
    await this._repository.update({
      id: event.aggregateId,
      status: ApplicationStatus.GOVERNANCE_REVIEW_PHASE,
    })
  }
}

@injectable()
export class KYCRejectedEventHandler implements IEventHandler<KYCRejected> {
  public event = KYCRejected.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: KYCRejected): Promise<void> {
    await this._repository.update({
      id: event.aggregateId,
      status: ApplicationStatus.REJECTED,
    })
  }
}

@injectable()
export class GovernanceReviewStartedEventHandler implements IEventHandler<GovernanceReviewStarted> {
  public event = GovernanceReviewStarted.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: GovernanceReviewStarted): Promise<void> {
    await this._repository.update({
      id: event.aggregateId,
      status: ApplicationStatus.GOVERNANCE_REVIEW_PHASE,
    })
  }
}

@injectable()
export class GovernanceReviewApprovedEventHandler implements IEventHandler<GovernanceReviewApproved> {
  public event = GovernanceReviewApproved.name

  constructor(@inject(TYPES.Db) private readonly _db: Db) {}

  async handle(event: GovernanceReviewApproved): Promise<void> {
    // Update allocator status in the database
    await this._db.collection('applicationDetails').updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: ApplicationStatus.RKH_APPROVAL_PHASE,
        },
      },
    )
  }
}

@injectable()
export class GovernanceReviewRejectedEventHandler implements IEventHandler<GovernanceReviewRejected> {
  public event = GovernanceReviewRejected.name

  constructor(@inject(TYPES.Db) private readonly _db: Db) {}

  async handle(event: GovernanceReviewRejected): Promise<void> {
    // Update allocator status in the database
    await this._db.collection('applicationDetails').updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: ApplicationStatus.REJECTED,
        },
      },
    )
  }
}

@injectable()
export class RKHApprovalStartedEventHandler implements IEventHandler<RKHApprovalStarted> {
  public event = RKHApprovalStarted.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: RKHApprovalStarted): Promise<void> {
    await this._repository.update({
      id: event.aggregateId,
      status: ApplicationStatus.RKH_APPROVAL_PHASE,
      rkhPhase: {
        approvals: [],
        approvalThreshold: event.approvalThreshold,
      },
    })
  }
}

@injectable()
export class RKHApprovalsUpdatedEventHandler implements IEventHandler<RKHApprovalsUpdated> {
  public event = RKHApprovalsUpdated.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: RKHApprovalsUpdated) {
    console.log('RKHApprovalsUpdatedEventHandler', event)

    await this._repository.update({
      id: event.aggregateId,
      status: ApplicationStatus.RKH_APPROVAL_PHASE,
      rkhPhase: {
        approvals: event.approvals,
        approvalThreshold: event.approvalThreshold,
      },
    })
  }
}

@injectable()
export class RKHApprovalCompletedEventHandler implements IEventHandler<RKHApprovalCompleted> {
  public event = RKHApprovalCompleted.name

  constructor(@inject(TYPES.Db) private readonly _db: Db) {}

  async handle(event: RKHApprovalCompleted) {
    // Update allocator status in the database
    await this._db.collection('applicationDetails').updateOne(
      { id: event.aggregateId },
      {
        $set: {
          status: ApplicationStatus.APPROVED,
        },
      },
    )
  }
}

@injectable()
export class DatacapAllocationUpdatedEventHandler implements IEventHandler<DatacapAllocationUpdated> {
  public event = DatacapAllocationUpdated.name

  constructor(
    @inject(TYPES.ApplicationDetailsRepository) private readonly _repository: IApplicationDetailsRepository,
  ) {}

  async handle(event: DatacapAllocationUpdated) {
    console.log('DatacapAllocationUpdatedEventHandler', event)

    await this._repository.update({
      id: event.aggregateId,
      status: ApplicationStatus.APPROVED,
      datacap: event.datacap,
    })
  }
}
