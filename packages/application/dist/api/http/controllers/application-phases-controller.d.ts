import { ICommandBus } from "@filecoin-plus/core";
import { Request, Response } from "express";
import { DatacapAllocatorPhase } from "../../../domain/datacap-allocator.js";
export declare class ApplicationPhasesController {
    private readonly _commandBus;
    constructor(_commandBus: ICommandBus);
    startPhase(allocatorId: string, phase: DatacapAllocatorPhase, res: Response): Promise<Response<any, Record<string, any>>>;
    completePhase(allocatorId: string, phase: DatacapAllocatorPhase, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
