import { Command } from "@filecoin-plus/core";
import { DatacapAllocatorPhase } from "../../../domain/datacap-allocator.js";
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
type PhaseResult<A, R> = {
    status: "approved";
    data: A;
} | {
    status: "rejected";
    data: R;
};
export declare class SubmitPhaseResultCommand<A, R> extends Command {
    readonly allocatorId: string;
    readonly phase: DatacapAllocatorPhase;
    readonly result: PhaseResult<A, R>;
    constructor(allocatorId: string, phase: DatacapAllocatorPhase, result: PhaseResult<A, R>);
}
type KYCResultData = {
    id: string;
    kycInquiryId: string;
    createdAt: string;
    documentId: string;
    documentType: string;
    platform: string;
    browser: string;
    scoreDocumentTotal: number;
    scoreBiometricLifeProof: number;
    scoreBiometricSelfie: number;
    scoreBiometricPhotoId: number;
    scoreBiometricDuplicateAttack: number;
    processCode: string;
    processMessage: string;
};
type KYCApprovedData = KYCResultData;
type KYCRejectedData = KYCApprovedData;
export declare class SubmitKYCResultCommand extends SubmitPhaseResultCommand<KYCApprovedData, KYCRejectedData> {
    constructor(allocatorId: string, result: PhaseResult<KYCApprovedData, KYCRejectedData>);
}
export declare class StartPhaseCommand extends Command {
    readonly allocatorId: string;
    readonly phase: DatacapAllocatorPhase;
    constructor(allocatorId: string, phase: DatacapAllocatorPhase);
}
export declare class CompletePhaseCommand extends Command {
    readonly allocatorId: string;
    readonly phase: DatacapAllocatorPhase;
    readonly data: {
        result: "approved" | "rejected";
        comments?: string;
    };
    constructor(allocatorId: string, phase: DatacapAllocatorPhase, data: {
        result: "approved" | "rejected";
        comments?: string;
    });
}
export declare class StartKYCCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export declare class ApproveKYCCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export declare class RejectKYCCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export declare class StartGovernanceReviewCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export declare class ApproveGovernanceReviewCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export declare class RejectGovernanceReviewCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export declare class SignRKHApprovalCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export declare class ApproveRKHApprovalCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export declare class RejectRKHApprovalCommand extends Command {
    readonly applicationId: string;
    constructor(applicationId: string);
}
export {};
