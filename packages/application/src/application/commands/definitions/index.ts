import { Command } from "@filecoin-plus/core";
import { DatacapAllocatorPhase } from "@src/domain/datacap-allocator";
import { KYCApprovedData, KYCRejectedData } from "@src/domain/kyc";



type PhaseResult<A, R> =
  | { status: "approved"; data: A }
  | { status: "rejected"; data: R };

export class SubmitPhaseResultCommand<A, R> extends Command {
  constructor(
    public readonly allocatorId: string,
    public readonly phase: DatacapAllocatorPhase,
    public readonly result: PhaseResult<A, R>
  ) {
    super();
  }
}

// V3

export class SubmitKYCResultCommand extends SubmitPhaseResultCommand<
  KYCApprovedData,
  KYCRejectedData
> {
  constructor(
    allocatorId: string,
    result: PhaseResult<KYCApprovedData, KYCRejectedData>
  ) {
    super(allocatorId, DatacapAllocatorPhase.KYC, result);
  }
}

// V2

// StartPhaseCommand
// POST /api/v2/allocators/{allocatorId}/phases/{phase}/start
export class StartPhaseCommand extends Command {
  constructor(
    public readonly allocatorId: string,
    public readonly phase: DatacapAllocatorPhase
  ) {
    super();
  }
}

// CompletePhaseCommand
// POST /api/v2/allocators/{allocatorId}/phases/{phase}/complete
export class CompletePhaseCommand extends Command {
  constructor(
    public readonly allocatorId: string,
    public readonly phase: DatacapAllocatorPhase,
    public readonly data: { result: "approved" | "rejected"; comments?: string }
  ) {
    super();
  }
}

// V1

// StartKYCCommand
// POST /api/v1/applications/{applicationId}/kyc
export class StartKYCCommand extends Command {
  constructor(public readonly applicationId: string) {
    super();
  }
}

// StartGovernanceReviewCommand
// POST /api/v1/applications/{applicationId}/review
export class StartGovernanceReviewCommand extends Command {
  constructor(public readonly applicationId: string) {
    super();
  }
}

// ApproveGovernanceReviewCommand
// POST /api/v1/applications/{applicationId}/review/approve
export class ApproveGovernanceReviewCommand extends Command {
  constructor(public readonly applicationId: string) {
    super();
  }
}

// RejectGovernanceReviewCommand
// POST /api/v1/applications/{applicationId}/review/reject
export class RejectGovernanceReviewCommand extends Command {
  constructor(public readonly applicationId: string) {
    super();
  }
}

// SignRKHApprovalCommand
// POST /api/v1/applications/{applicationId}/approval
export class SignRKHApprovalCommand extends Command {
  constructor(public readonly applicationId: string) {
    super();
  }
}

// ApproveRKHApprovalCommand
// POST /api/v1/applications/{applicationId}/approval/approve
export class ApproveRKHApprovalCommand extends Command {
  constructor(public readonly applicationId: string) {
    super();
  }
}

// RejectRKHApprovalCommand
// POST /api/v1/applications/{applicationId}/approval/reject
export class RejectRKHApprovalCommand extends Command {
  constructor(public readonly applicationId: string) {
    super();
  }
}
