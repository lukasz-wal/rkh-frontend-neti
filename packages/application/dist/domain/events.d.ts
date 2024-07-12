import { Event } from "@filecoin-plus/core";
export declare class AllocatorApplied extends Event {
    guid: string;
    firstname: string;
    lastname: string;
    email: string;
    githubId: string;
    currentPosition: string;
    eventName: string;
    aggregateName: string;
    constructor(guid: string, firstname: string, lastname: string, email: string, githubId: string, currentPosition: string);
}
export declare class KYCStarted extends Event {
    allocatorId: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(allocatorId: string, timestamp: Date);
}
export declare class KYCApproved extends Event {
    allocatorId: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(allocatorId: string, timestamp: Date);
}
export declare class KYCRejected extends Event {
    allocatorId: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(allocatorId: string, timestamp: Date);
}
export declare class GovernanceReviewStarted extends Event {
    allocatorId: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(allocatorId: string, timestamp: Date);
}
export declare class GovernanceReviewApproved extends Event {
    allocatorId: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(allocatorId: string, timestamp: Date);
}
export declare class GovernanceReviewRejected extends Event {
    allocatorId: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(allocatorId: string, timestamp: Date);
}
export declare class RKHActionProposed extends Event {
    guid: string;
    transactionId: string;
    allocatorId: string;
    proposedBy: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(guid: string, transactionId: string, allocatorId: string, proposedBy: string, timestamp: Date);
}
export declare class RKHActionConfirmed extends Event {
    guid: string;
    transactionId: string;
    allocatorId: string;
    confirmedBy: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(guid: string, transactionId: string, allocatorId: string, confirmedBy: string, timestamp: Date);
}
export declare class DatacapGranted extends Event {
    guid: string;
    allocatorId: string;
    datacapAmount: number;
    grantedBy: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(guid: string, allocatorId: string, datacapAmount: number, grantedBy: string, timestamp: Date);
}
export declare class ApplicationPullRequestCreated extends Event {
    guid: string;
    prNumber: number;
    prUrl: string;
    timestamp: Date;
    eventName: string;
    aggregateName: string;
    constructor(guid: string, prNumber: number, prUrl: string, timestamp: Date);
}
