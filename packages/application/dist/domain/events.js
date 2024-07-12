import { Event } from "@filecoin-plus/core";
export class AllocatorApplied extends Event {
    guid;
    firstname;
    lastname;
    email;
    githubId;
    currentPosition;
    eventName = AllocatorApplied.name;
    aggregateName = 'allocator';
    constructor(guid, firstname, lastname, email, githubId, currentPosition) {
        super(guid);
        this.guid = guid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.githubId = githubId;
        this.currentPosition = currentPosition;
    }
}
export class KYCStarted extends Event {
    allocatorId;
    timestamp;
    eventName = KYCStarted.name;
    aggregateName = 'allocator';
    constructor(allocatorId, timestamp) {
        super(allocatorId);
        this.allocatorId = allocatorId;
        this.timestamp = timestamp;
    }
}
export class KYCApproved extends Event {
    allocatorId;
    timestamp;
    eventName = KYCApproved.name;
    aggregateName = 'allocator';
    constructor(allocatorId, timestamp) {
        super(allocatorId);
        this.allocatorId = allocatorId;
        this.timestamp = timestamp;
    }
}
export class KYCRejected extends Event {
    allocatorId;
    timestamp;
    eventName = KYCRejected.name;
    aggregateName = 'allocator';
    constructor(allocatorId, timestamp) {
        super(allocatorId);
        this.allocatorId = allocatorId;
        this.timestamp = timestamp;
    }
}
export class GovernanceReviewStarted extends Event {
    allocatorId;
    timestamp;
    eventName = GovernanceReviewStarted.name;
    aggregateName = 'allocator';
    constructor(allocatorId, timestamp) {
        super(allocatorId);
        this.allocatorId = allocatorId;
        this.timestamp = timestamp;
    }
}
export class GovernanceReviewApproved extends Event {
    allocatorId;
    timestamp;
    eventName = GovernanceReviewApproved.name;
    aggregateName = 'allocator';
    constructor(allocatorId, timestamp) {
        super(allocatorId);
        this.allocatorId = allocatorId;
        this.timestamp = timestamp;
    }
}
export class GovernanceReviewRejected extends Event {
    allocatorId;
    timestamp;
    eventName = GovernanceReviewRejected.name;
    aggregateName = 'allocator';
    constructor(allocatorId, timestamp) {
        super(allocatorId);
        this.allocatorId = allocatorId;
        this.timestamp = timestamp;
    }
}
export class RKHActionProposed extends Event {
    guid;
    transactionId;
    allocatorId;
    proposedBy;
    timestamp;
    eventName = RKHActionProposed.name;
    aggregateName = 'rkh';
    constructor(guid, transactionId, allocatorId, proposedBy, timestamp) {
        super(guid);
        this.guid = guid;
        this.transactionId = transactionId;
        this.allocatorId = allocatorId;
        this.proposedBy = proposedBy;
        this.timestamp = timestamp;
    }
}
export class RKHActionConfirmed extends Event {
    guid;
    transactionId;
    allocatorId;
    confirmedBy;
    timestamp;
    eventName = RKHActionConfirmed.name;
    aggregateName = 'rkh';
    constructor(guid, transactionId, allocatorId, confirmedBy, timestamp) {
        super(guid);
        this.guid = guid;
        this.transactionId = transactionId;
        this.allocatorId = allocatorId;
        this.confirmedBy = confirmedBy;
        this.timestamp = timestamp;
    }
}
export class DatacapGranted extends Event {
    guid;
    allocatorId;
    datacapAmount;
    grantedBy;
    timestamp;
    eventName = DatacapGranted.name;
    aggregateName = 'allocator';
    constructor(guid, allocatorId, datacapAmount, grantedBy, timestamp) {
        super(guid);
        this.guid = guid;
        this.allocatorId = allocatorId;
        this.datacapAmount = datacapAmount;
        this.grantedBy = grantedBy;
        this.timestamp = timestamp;
    }
}
export class ApplicationPullRequestCreated extends Event {
    guid;
    prNumber;
    prUrl;
    timestamp;
    eventName = ApplicationPullRequestCreated.name;
    aggregateName = 'allocator';
    constructor(guid, prNumber, prUrl, timestamp) {
        super(guid);
        this.guid = guid;
        this.prNumber = prNumber;
        this.prUrl = prUrl;
        this.timestamp = timestamp;
    }
}
