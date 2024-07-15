import { Event } from "@filecoin-plus/core";
import { KYCApprovedData, KYCRejectedData } from "./kyc";

export class AllocatorApplied extends Event {
  eventName = AllocatorApplied.name;
  aggregateName = "allocator";

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

export class ApplicationSubmitted extends Event {
  eventName = ApplicationSubmitted.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(
    allocatorId: string,
    public prNumber: number,
    public prUrl: string
  ) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class KYCStarted extends Event {
  eventName = KYCStarted.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class KYCApproved extends Event {
  eventName = KYCApproved.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string, public data: KYCApprovedData) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class KYCRejected extends Event {
  eventName = KYCRejected.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string, public data: KYCRejectedData) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class GovernanceReviewStarted extends Event {
  eventName = GovernanceReviewStarted.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class GovernanceReviewApproved extends Event {
  eventName = GovernanceReviewApproved.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string) {
    super(allocatorId);
  }
}

export class GovernanceReviewRejected extends Event {
  eventName = GovernanceReviewRejected.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string) {
    super(allocatorId);
  }
}

export class RKHApprovalStarted extends Event {
  eventName = RKHApprovalStarted.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(
    allocatorId: string,
    // TODO: public readonly multisigAddress: string,
    public readonly approvalThreshold: number,
    // TODO: public readonly signers: string[]
  ) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class RKHSignatureSubmitted extends Event {
  eventName = RKHSignatureSubmitted.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string, public readonly signer: string) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class RKHApprovalApproved extends Event {
  eventName = RKHApprovalApproved.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class RKHApprovalRejected extends Event {
  eventName = RKHApprovalRejected.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

// OLD

export class RKHActionProposed extends Event {
  eventName = RKHActionProposed.name;
  aggregateName = "rkh";

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
  aggregateName = "rkh";

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
  aggregateName = "allocator";

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
