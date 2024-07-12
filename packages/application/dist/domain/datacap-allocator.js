import { AggregateRoot, ApplicationError, } from "@filecoin-plus/core";
import { StatusCodes } from "http-status-codes";
import { AllocatorApplied, ApplicationPullRequestCreated, DatacapGranted, GovernanceReviewStarted, KYCStarted, KYCApproved, KYCRejected, GovernanceReviewApproved, GovernanceReviewRejected, } from "./events.js";
export var DatacapAllocatorPhase;
(function (DatacapAllocatorPhase) {
    DatacapAllocatorPhase["SUBMISSION"] = "SUBMISSION";
    DatacapAllocatorPhase["KYC"] = "KYC";
    DatacapAllocatorPhase["GOVERNANCE_REVIEW"] = "GOVERNANCE_REVIEW";
    DatacapAllocatorPhase["RKH_APPROVAL"] = "RKH_APPROVAL";
    DatacapAllocatorPhase["DATA_CAP_GRANT"] = "DATA_CAP_GRANT";
})(DatacapAllocatorPhase || (DatacapAllocatorPhase = {}));
export var DatacapAllocatorPhaseStatus;
(function (DatacapAllocatorPhaseStatus) {
    DatacapAllocatorPhaseStatus["NOT_STARTED"] = "NOT_STARTED";
    DatacapAllocatorPhaseStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DatacapAllocatorPhaseStatus["COMPLETED"] = "COMPLETED";
    DatacapAllocatorPhaseStatus["FAILED"] = "FAILED";
})(DatacapAllocatorPhaseStatus || (DatacapAllocatorPhaseStatus = {}));
export class DatacapAllocator extends AggregateRoot {
    firstname;
    lastname;
    email;
    githubId;
    currentPosition;
    status;
    datacapAmount;
    applicationPullRequest;
    constructor(guid, firstname, lastname, email, githubId, currentPosition) {
        super(guid);
        if (guid && firstname && lastname && email && githubId && currentPosition) {
            this.applyChange(new AllocatorApplied(guid, firstname, lastname, email, githubId, currentPosition));
        }
    }
    startKYC() {
        if (this.status.phase !== DatacapAllocatorPhase.KYC ||
            this.status.phaseStatus !== DatacapAllocatorPhaseStatus.NOT_STARTED) {
            throw new ApplicationError(StatusCodes.BAD_REQUEST, "5308", "KYC is already started");
        }
        this.applyChange(new KYCStarted(this.guid, new Date()));
    }
    approveKYC() {
        if (this.status.phase !== DatacapAllocatorPhase.KYC) {
            throw new ApplicationError(StatusCodes.BAD_REQUEST, "5309", "Not in KYC phase");
        }
        if (this.status.phaseStatus === DatacapAllocatorPhaseStatus.COMPLETED ||
            this.status.phaseStatus === DatacapAllocatorPhaseStatus.FAILED) {
            throw new ApplicationError(StatusCodes.BAD_REQUEST, "5310", "KYC is already finished");
        }
        this.applyChange(new KYCApproved(this.guid, new Date()));
    }
    rejectKYC() {
        if (this.status.phase !== DatacapAllocatorPhase.KYC) {
            throw new ApplicationError(StatusCodes.BAD_REQUEST, "5309", "Not in KYC phase");
        }
        if (this.status.phaseStatus === DatacapAllocatorPhaseStatus.COMPLETED ||
            this.status.phaseStatus === DatacapAllocatorPhaseStatus.FAILED) {
            throw new ApplicationError(StatusCodes.BAD_REQUEST, "5310", "KYC is already finished");
        }
        this.applyChange(new KYCRejected(this.guid, new Date()));
    }
    startGovernanceReview() {
        if (this.status.phase !== DatacapAllocatorPhase.GOVERNANCE_REVIEW &&
            this.status.phaseStatus !== DatacapAllocatorPhaseStatus.NOT_STARTED) {
            throw new ApplicationError(StatusCodes.BAD_REQUEST, "5311", "KYC is not completed");
        }
        this.applyChange(new GovernanceReviewStarted(this.guid, new Date()));
    }
    approveGovernanceReview() {
        if (this.status.phase !== DatacapAllocatorPhase.GOVERNANCE_REVIEW ||
            this.status.phaseStatus !== DatacapAllocatorPhaseStatus.IN_PROGRESS) {
            throw new ApplicationError(StatusCodes.BAD_REQUEST, "5312", "Governance review is not started");
        }
        this.applyChange(new GovernanceReviewApproved(this.guid, new Date()));
    }
    rejectGovernanceReview() {
        if (this.status.phase !== DatacapAllocatorPhase.GOVERNANCE_REVIEW ||
            this.status.phaseStatus !== DatacapAllocatorPhaseStatus.IN_PROGRESS) {
            throw new ApplicationError(StatusCodes.BAD_REQUEST, "5312", "Governance review is not started");
        }
        this.applyChange(new GovernanceReviewRejected(this.guid, new Date()));
    }
    grantDatacap(datacapAmount, grantedBy, timestamp) {
        this.applyChange(new DatacapGranted(this.guid, this.allocatorId, datacapAmount, grantedBy, timestamp));
    }
    createApplicationPullRequest(pullRequestNumber, pullRequestUrl) {
        this.applyChange(new ApplicationPullRequestCreated(this.guid, pullRequestNumber, pullRequestUrl, new Date()));
    }
    applyAllocatorApplied(event) {
        this.guid = event.guid;
        this.firstname = event.firstname;
        this.lastname = event.lastname;
        this.email = event.email;
        this.githubId = event.githubId;
        this.currentPosition = event.currentPosition;
        this.status = {
            phase: DatacapAllocatorPhase.KYC,
            phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
        };
    }
    applyKYCStarted(event) {
        this.status = {
            phase: DatacapAllocatorPhase.KYC,
            phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
        };
    }
    applyKYCApproved(event) {
        this.status = {
            phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
            phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
        };
    }
    applyKYCRejected(event) {
        this.status = {
            phase: DatacapAllocatorPhase.KYC,
            phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
        };
    }
    applyGovernanceReviewStarted(event) {
        this.status = {
            phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
            phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
        };
    }
    applyGovernanceReviewApproved(event) {
        this.status = {
            phase: DatacapAllocatorPhase.RKH_APPROVAL,
            phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
        };
    }
    applyGovernanceReviewRejected(event) {
        this.status = {
            phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
            phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
        };
    }
    applyDatacapGranted(event) {
        this.datacapAmount = event.datacapAmount;
    }
    applyApplicationPullRequestCreated(event) {
        this.applicationPullRequest = {
            prNumber: event.prNumber,
            prUrl: event.prUrl,
            timestamp: event.timestamp,
        };
    }
}
