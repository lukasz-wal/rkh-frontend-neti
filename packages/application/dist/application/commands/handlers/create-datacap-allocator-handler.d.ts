import { ICommandHandler } from "@filecoin-plus/core";
import { CreateDatacapAllocatorCommand } from "../definitions/create-datacap-allocator.js";
import { IDatacapAllocatorRepository } from "../../../domain/datacap-allocator.js";
export declare class CreateDatacapAllocatorCommandHandler implements ICommandHandler<CreateDatacapAllocatorCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: CreateDatacapAllocatorCommand): Promise<{
        guid: string;
    }>;
}
