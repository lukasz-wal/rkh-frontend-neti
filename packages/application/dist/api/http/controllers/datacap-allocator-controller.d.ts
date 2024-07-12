import { ICommandBus, IQueryBus } from "@filecoin-plus/core";
import { Request, Response } from "express";
export declare class DatacapAllocatorController {
    private readonly _commandBus;
    private readonly _queryBus;
    constructor(_commandBus: ICommandBus, _queryBus: IQueryBus);
    createDatacapAllocator(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllDatacapAllocators(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getDatacapAllocator(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    setGovernanceReviewStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
