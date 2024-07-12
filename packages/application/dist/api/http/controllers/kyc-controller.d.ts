import { ICommandBus } from "@filecoin-plus/core";
import { Response, Request } from "express";
export declare class KycController {
    private readonly _commandBus;
    constructor(_commandBus: ICommandBus);
    startKYC(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    approveKYC(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    rejectKYC(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    submitKYCResult(id: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
