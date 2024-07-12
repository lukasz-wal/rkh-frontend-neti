import { ICommandHandler } from "@filecoin-plus/core";
import { SetDatacapAllocatorKycStatusCommand } from "../definitions/set-datacap-allocator-kyc-status.js";
import { IDatacapAllocatorRepository } from "../../../domain/datacap-allocator.js";
export declare class SetDatacapAllocatorKycStatusCommandHandler implements ICommandHandler<SetDatacapAllocatorKycStatusCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: SetDatacapAllocatorKycStatusCommand): Promise<{
        guid: string;
    }>;
}
