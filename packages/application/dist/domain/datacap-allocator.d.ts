import { AggregateRoot, IEventStore, IRepository } from "@filecoin-plus/core";
import { AllocatorApplied, ApplicationPullRequestCreated, DatacapGranted, GovernanceReviewStarted, KYCStarted, KYCApproved, KYCRejected, GovernanceReviewApproved, GovernanceReviewRejected } from "./events.js";
export interface IDatacapAllocatorRepository extends IRepository<DatacapAllocator> {
}
export interface IDatacapAllocatorEventStore extends IEventStore<DatacapAllocator> {
}
export declare enum DatacapAllocatorPhase {
    SUBMISSION = "SUBMISSION",
    KYC = "KYC",
    GOVERNANCE_REVIEW = "GOVERNANCE_REVIEW",
    RKH_APPROVAL = "RKH_APPROVAL",
    DATA_CAP_GRANT = "DATA_CAP_GRANT"
}
export declare enum DatacapAllocatorPhaseStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export type DatacapAllocatorStatus = {
    phase: DatacapAllocatorPhase;
    phaseStatus: DatacapAllocatorPhaseStatus;
};
export type ApplicationPullRequest = {
    prNumber: number;
    prUrl: string;
    timestamp: Date;
};
export declare class DatacapAllocator extends AggregateRoot {
    firstname: string;
    lastname: string;
    email: string;
    githubId: string;
    currentPosition: string;
    status: DatacapAllocatorStatus;
    datacapAmount: number;
    applicationPullRequest: ApplicationPullRequest;
    constructor();
    constructor(guid: string, firstname: string, lastname: string, email: string, githubId: string, currentPosition: string);
    startKYC(): void;
    approveKYC(): void;
    rejectKYC(): void;
    startGovernanceReview(): void;
    approveGovernanceReview(): void;
    rejectGovernanceReview(): void;
    grantDatacap(datacapAmount: number, grantedBy: string, timestamp: Date): void;
    createApplicationPullRequest(pullRequestNumber: number, pullRequestUrl: string): void;
    applyAllocatorApplied(event: AllocatorApplied): void;
    applyKYCStarted(event: KYCStarted): void;
    applyKYCApproved(event: KYCApproved): void;
    applyKYCRejected(event: KYCRejected): void;
    applyGovernanceReviewStarted(event: GovernanceReviewStarted): void;
    applyGovernanceReviewApproved(event: GovernanceReviewApproved): void;
    applyGovernanceReviewRejected(event: GovernanceReviewRejected): void;
    applyDatacapGranted(event: DatacapGranted): void;
    applyApplicationPullRequestCreated(event: ApplicationPullRequestCreated): void;
}
