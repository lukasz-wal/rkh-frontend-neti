import { Event } from "@filecoin-plus/core";

export class AllocatorApplied extends Event {
  eventName = AllocatorApplied.name;
  aggregateName = 'allocator';

  constructor(
    public guid: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public githubId: string,
    public currentPosition: string
  ) {
    super(guid);
  }
}

export class KYCStarted extends Event {
  eventName = KYCStarted.name;
  aggregateName = 'allocator';

  constructor(
    public allocatorId: string,
    public timestamp: Date
  ) {
    super(allocatorId);
  }
}

export class KYCApproved extends Event {
  eventName = KYCApproved.name;
  aggregateName = 'allocator';

  constructor(
    public allocatorId: string,
    public timestamp: Date
  ) {
    super(allocatorId);
  }
}

export class KYCRejected extends Event {
  eventName = KYCRejected.name;
  aggregateName = 'allocator';

  constructor(
    public allocatorId: string,
    public timestamp: Date
  ) {
    super(allocatorId);
  }
}

export class GovernanceReviewStarted extends Event {
  eventName = GovernanceReviewStarted.name;
  aggregateName = 'allocator';

  constructor(
    public allocatorId: string,
    public timestamp: Date
  ) {
    super(allocatorId);
  }
}

export class GovernanceReviewApproved extends Event {
  eventName = GovernanceReviewApproved.name;
  aggregateName = 'allocator';

  constructor(
    public allocatorId: string,
    public timestamp: Date
  ) {
    super(allocatorId);
  }
}

export class GovernanceReviewRejected extends Event {
  eventName = GovernanceReviewRejected.name;
  aggregateName = 'allocator';

  constructor(
    public allocatorId: string,
    public timestamp: Date
  ) {
    super(allocatorId);
  }
}

export class RKHActionProposed extends Event {
  eventName = RKHActionProposed.name;
  aggregateName = 'rkh';

  constructor(
    public guid: string,
    public transactionId: string,
    public allocatorId: string,
    public proposedBy: string,
    public timestamp: Date
  ) {
    super(guid);
  }
}

export class RKHActionConfirmed extends Event {
  eventName = RKHActionConfirmed.name;
  aggregateName = 'rkh';

  constructor(
    public guid: string,
    public transactionId: string,
    public allocatorId: string,
    public confirmedBy: string,
    public timestamp: Date
  ) {
    super(guid);
  }
}

export class DatacapGranted extends Event {
  eventName = DatacapGranted.name;
  aggregateName = 'allocator';

  constructor(
    public guid: string,
    public allocatorId: string,
    public datacapAmount: number,
    public grantedBy: string,
    public timestamp: Date
  ) {
    super(guid);
  }
}

export class ApplicationPullRequestCreated extends Event {
  eventName = ApplicationPullRequestCreated.name;
  aggregateName = 'allocator';

  constructor(
    public guid: string,
    public prNumber: number,
    public prUrl: string,
    public timestamp: Date
  ) {
    super(guid);
  }
}