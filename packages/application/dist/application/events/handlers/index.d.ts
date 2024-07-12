import { IEventHandler } from "@filecoin-plus/core";
import { Db } from "mongodb";
import { GovernanceReviewApproved, GovernanceReviewRejected, GovernanceReviewStarted, KYCApproved, KYCRejected, KYCStarted } from "../../../domain/events.js";
import { CommandBus } from "../../../infrastructure/command-bus/index.js";
export declare class KYCStartedEventHandler implements IEventHandler<KYCStarted> {
    private readonly _commandBus;
    private readonly _db;
    event: string;
    constructor(_commandBus: CommandBus, _db: Db);
    handle(event: KYCStarted): Promise<void>;
}
export declare class KYCApprovedEventHandler implements IEventHandler<KYCApproved> {
    private readonly _commandBus;
    private readonly _db;
    event: string;
    constructor(_commandBus: CommandBus, _db: Db);
    handle(event: KYCApproved): Promise<void>;
}
export declare class KYCRejectedEventHandler implements IEventHandler<KYCRejected> {
    private readonly _commandBus;
    private readonly _db;
    event: string;
    constructor(_commandBus: CommandBus, _db: Db);
    handle(event: KYCRejected): Promise<void>;
}
export declare class GovernanceReviewStartedEventHandler implements IEventHandler<GovernanceReviewStarted> {
    private readonly _commandBus;
    private readonly _db;
    event: string;
    constructor(_commandBus: CommandBus, _db: Db);
    handle(event: GovernanceReviewStarted): Promise<void>;
}
export declare class GovernanceReviewApprovedEventHandler implements IEventHandler<GovernanceReviewApproved> {
    private readonly _commandBus;
    private readonly _db;
    event: string;
    constructor(_commandBus: CommandBus, _db: Db);
    handle(event: GovernanceReviewApproved): Promise<void>;
}
export declare class GovernanceReviewRejectedEventHandler implements IEventHandler<GovernanceReviewRejected> {
    private readonly _commandBus;
    private readonly _db;
    event: string;
    constructor(_commandBus: CommandBus, _db: Db);
    handle(event: GovernanceReviewRejected): Promise<void>;
}
