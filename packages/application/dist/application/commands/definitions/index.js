import { Command } from "@filecoin-plus/core";
import { DatacapAllocatorPhase } from "../../../domain/datacap-allocator.js";
export class SubmitPhaseResultCommand extends Command {
    allocatorId;
    phase;
    result;
    constructor(allocatorId, phase, result) {
        super();
        this.allocatorId = allocatorId;
        this.phase = phase;
        this.result = result;
    }
}
// V3
export class SubmitKYCResultCommand extends SubmitPhaseResultCommand {
    constructor(allocatorId, result) {
        super(allocatorId, DatacapAllocatorPhase.KYC, result);
    }
}
// V2
// StartPhaseCommand
// POST /api/v2/allocators/{allocatorId}/phases/{phase}/start
export class StartPhaseCommand extends Command {
    allocatorId;
    phase;
    constructor(allocatorId, phase) {
        super();
        this.allocatorId = allocatorId;
        this.phase = phase;
    }
}
// CompletePhaseCommand
// POST /api/v2/allocators/{allocatorId}/phases/{phase}/complete
export class CompletePhaseCommand extends Command {
    allocatorId;
    phase;
    data;
    constructor(allocatorId, phase, data) {
        super();
        this.allocatorId = allocatorId;
        this.phase = phase;
        this.data = data;
    }
}
// V1
// StartKYCCommand
// POST /api/v1/applications/{applicationId}/kyc
export class StartKYCCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
// ApproveKYCCommand
// POST /api/v1/applications/{applicationId}/kyc/approve
export class ApproveKYCCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
// RejectKYCCommand
// POST /api/v1/applications/{applicationId}/kyc/reject
export class RejectKYCCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
// StartGovernanceReviewCommand
// POST /api/v1/applications/{applicationId}/review
export class StartGovernanceReviewCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
// ApproveGovernanceReviewCommand
// POST /api/v1/applications/{applicationId}/review/approve
export class ApproveGovernanceReviewCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
// RejectGovernanceReviewCommand
// POST /api/v1/applications/{applicationId}/review/reject
export class RejectGovernanceReviewCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
// SignRKHApprovalCommand
// POST /api/v1/applications/{applicationId}/approval
export class SignRKHApprovalCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
// ApproveRKHApprovalCommand
// POST /api/v1/applications/{applicationId}/approval/approve
export class ApproveRKHApprovalCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
// RejectRKHApprovalCommand
// POST /api/v1/applications/{applicationId}/approval/reject
export class RejectRKHApprovalCommand extends Command {
    applicationId;
    constructor(applicationId) {
        super();
        this.applicationId = applicationId;
    }
}
