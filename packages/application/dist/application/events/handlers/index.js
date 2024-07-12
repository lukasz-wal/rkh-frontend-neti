var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "inversify";
import { Db } from "mongodb";
import { GovernanceReviewApproved, GovernanceReviewRejected, GovernanceReviewStarted, KYCApproved, KYCRejected, KYCStarted } from "../../../domain/events.js";
import { CommandBus } from "../../../infrastructure/command-bus/index.js";
import { TYPES } from "../../../types.js";
import { UpdateApplicationPullRequestCommand } from "../../../application/commands/definitions/update-application-pr.js";
import { DatacapAllocatorPhase, DatacapAllocatorPhaseStatus, } from "../../../domain/datacap-allocator.js";
let KYCStartedEventHandler = class KYCStartedEventHandler {
    _commandBus;
    _db;
    event = KYCStarted.name;
    constructor(_commandBus, _db) {
        this._commandBus = _commandBus;
        this._db = _db;
    }
    async handle(event) {
        // Update allocator status in the database
        await this._db.collection("datacapAllocators").updateOne({ id: event.aggregateId }, {
            $set: {
                status: {
                    phase: DatacapAllocatorPhase.KYC,
                    phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
                },
            },
        });
        const result = await this._commandBus.send(new UpdateApplicationPullRequestCommand(event.aggregateId));
    }
};
KYCStartedEventHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.CommandBus)),
    __param(1, inject(TYPES.Db)),
    __metadata("design:paramtypes", [CommandBus,
        Db])
], KYCStartedEventHandler);
export { KYCStartedEventHandler };
let KYCApprovedEventHandler = class KYCApprovedEventHandler {
    _commandBus;
    _db;
    event = KYCApproved.name;
    constructor(_commandBus, _db) {
        this._commandBus = _commandBus;
        this._db = _db;
    }
    async handle(event) {
        // Update allocator status in the database
        await this._db.collection("datacapAllocators").updateOne({ id: event.aggregateId }, {
            $set: {
                status: {
                    phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
                    phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
                },
            },
        });
        const result = await this._commandBus.send(new UpdateApplicationPullRequestCommand(event.aggregateId));
    }
};
KYCApprovedEventHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.CommandBus)),
    __param(1, inject(TYPES.Db)),
    __metadata("design:paramtypes", [CommandBus,
        Db])
], KYCApprovedEventHandler);
export { KYCApprovedEventHandler };
let KYCRejectedEventHandler = class KYCRejectedEventHandler {
    _commandBus;
    _db;
    event = KYCRejected.name;
    constructor(_commandBus, _db) {
        this._commandBus = _commandBus;
        this._db = _db;
    }
    async handle(event) {
        // Update allocator status in the database
        await this._db.collection("datacapAllocators").updateOne({ id: event.aggregateId }, {
            $set: {
                status: {
                    phase: DatacapAllocatorPhase.KYC,
                    phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
                },
            },
        });
        const result = await this._commandBus.send(new UpdateApplicationPullRequestCommand(event.aggregateId));
    }
};
KYCRejectedEventHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.CommandBus)),
    __param(1, inject(TYPES.Db)),
    __metadata("design:paramtypes", [CommandBus,
        Db])
], KYCRejectedEventHandler);
export { KYCRejectedEventHandler };
let GovernanceReviewStartedEventHandler = class GovernanceReviewStartedEventHandler {
    _commandBus;
    _db;
    event = GovernanceReviewStarted.name;
    constructor(_commandBus, _db) {
        this._commandBus = _commandBus;
        this._db = _db;
    }
    async handle(event) {
        // Update allocator status in the database
        await this._db.collection("datacapAllocators").updateOne({ id: event.aggregateId }, {
            $set: {
                status: {
                    phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
                    phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
                },
            },
        });
        const result = await this._commandBus.send(new UpdateApplicationPullRequestCommand(event.aggregateId));
    }
};
GovernanceReviewStartedEventHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.CommandBus)),
    __param(1, inject(TYPES.Db)),
    __metadata("design:paramtypes", [CommandBus,
        Db])
], GovernanceReviewStartedEventHandler);
export { GovernanceReviewStartedEventHandler };
let GovernanceReviewApprovedEventHandler = class GovernanceReviewApprovedEventHandler {
    _commandBus;
    _db;
    event = GovernanceReviewApproved.name;
    constructor(_commandBus, _db) {
        this._commandBus = _commandBus;
        this._db = _db;
    }
    async handle(event) {
        // Update allocator status in the database
        await this._db.collection("datacapAllocators").updateOne({ id: event.aggregateId }, {
            $set: {
                status: {
                    phase: DatacapAllocatorPhase.RKH_APPROVAL,
                    phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
                },
            },
        });
        const result = await this._commandBus.send(new UpdateApplicationPullRequestCommand(event.aggregateId));
    }
};
GovernanceReviewApprovedEventHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.CommandBus)),
    __param(1, inject(TYPES.Db)),
    __metadata("design:paramtypes", [CommandBus,
        Db])
], GovernanceReviewApprovedEventHandler);
export { GovernanceReviewApprovedEventHandler };
let GovernanceReviewRejectedEventHandler = class GovernanceReviewRejectedEventHandler {
    _commandBus;
    _db;
    event = GovernanceReviewRejected.name;
    constructor(_commandBus, _db) {
        this._commandBus = _commandBus;
        this._db = _db;
    }
    async handle(event) {
        // Update allocator status in the database
        await this._db.collection("datacapAllocators").updateOne({ id: event.aggregateId }, {
            $set: {
                status: {
                    phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
                    phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
                },
            },
        });
        const result = await this._commandBus.send(new UpdateApplicationPullRequestCommand(event.aggregateId));
    }
};
GovernanceReviewRejectedEventHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.CommandBus)),
    __param(1, inject(TYPES.Db)),
    __metadata("design:paramtypes", [CommandBus,
        Db])
], GovernanceReviewRejectedEventHandler);
export { GovernanceReviewRejectedEventHandler };
