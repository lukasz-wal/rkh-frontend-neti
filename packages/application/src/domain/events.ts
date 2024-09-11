import { Event } from "@filecoin-plus/core";
import { KYCApprovedData, KYCRejectedData } from "./kyc";

export class AllocatorApplied extends Event {
  eventName = AllocatorApplied.name;
  aggregateName = "allocator";

  constructor(
    public guid: string,
    public number: number,
    public name: string,
    public organization: string,
    public address: string,
    public githubUsername: string,
    public country: string,
    public region: string,
    public type: string,
    public datacap: number,
    public targetClients: string[],
    public dataTypes: string[],
    public requiredReplicas: string,
    public requiredOperators: string,
    public standardizedAllocations: string
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
    public prUrl: string,
    public commentId: number
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

export class RKHApprovalsUpdated extends Event {
  eventName = RKHApprovalsUpdated.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string, public approvals: string[]) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}


export class RKHApprovalCompleted extends Event {
  eventName = RKHApprovalCompleted.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}

export class DatacapAllocationUpdated extends Event {
  eventName = DatacapAllocationUpdated.name;
  aggregateName = "allocator";

  public timestamp: Date;

  constructor(allocatorId: string, public datacap: number) {
    super(allocatorId);
    this.timestamp = new Date();
  }
}