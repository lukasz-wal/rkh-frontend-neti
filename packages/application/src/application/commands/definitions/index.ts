import { Command } from "@filecoin-plus/core";
import { DatacapAllocatorPhase } from "@src/domain/datacap-allocator";

/**
  {
    result_id: 'f49d3a83-3dac-464a-b97a-bd8f7f1fa9b9',
    event: 'success',
    data: {
      kyc: {
        id: 'f49d3a83-3dac-464a-b97a-bd8f7f1fa9b9',
        kycInquiryId: 'ABBB',
        createdAt: '2023-10-03T10:31:51.303476Z',
        tenantId: '6098ca37-d11e-4b66-9344-3837dd3852f9',
        status: 'success',
        documentId: 'f915626947e64baf9a1454c6e662ecd1',
        documentType: 'GB_DrivingLicense_2015',
        platform: 'iOS',
        browser: 'Mozilla/5.0',
        scoreDocumentTotal: 0.9968421,
        scoreBiometricLifeProof: 0.90229774,
        scoreBiometricSelfie: 0.99972534,
        scoreBiometricPhotoId: 0.99972534,
        scoreBiometricDuplicateAttack: 0.55731136,
        processCode: 'ProcessCompleted',
        processMessage: 'The process has been successfully completed',
        identityId: 'user@gmail.com'
      }
    }
  }
 */

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

type KYCResultData = {
  // IDs
  id: string;
  kycInquiryId: string;

  // Metadata
  createdAt: string;
  documentId: string;
  documentType: string;
  platform: string;
  browser: string;

  // Scores
  scoreDocumentTotal: number;
  scoreBiometricLifeProof: number;
  scoreBiometricSelfie: number;
  scoreBiometricPhotoId: number;
  scoreBiometricDuplicateAttack: number;

  // Other
  processCode: string;
  processMessage: string;
};

type KYCApprovedData = KYCResultData;
type KYCRejectedData = KYCApprovedData;

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

// ApproveKYCCommand
// POST /api/v1/applications/{applicationId}/kyc/approve
export class ApproveKYCCommand extends Command {
  constructor(public readonly applicationId: string) {
    super();
  }
}

// RejectKYCCommand
// POST /api/v1/applications/{applicationId}/kyc/reject
export class RejectKYCCommand extends Command {
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
