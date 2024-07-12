import { IEventHandler } from "@filecoin-plus/core";
import { Db } from "mongodb";
import { AllocatorApplied } from "../../../domain/events.js";
import { CommandBus } from "../../../infrastructure/command-bus/index.js";
export declare class AllocatorAppliedEventHandler implements IEventHandler<AllocatorApplied> {
    private readonly _commandBus;
    private readonly _db;
    event: string;
    constructor(_commandBus: CommandBus, _db: Db);
    handle(event: AllocatorApplied): Promise<void>;
}
