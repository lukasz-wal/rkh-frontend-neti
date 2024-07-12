import { ICommandHandler } from "@filecoin-plus/core";
import { ApproveKYCCommand, CompletePhaseCommand, RejectKYCCommand, StartKYCCommand, StartPhaseCommand, SubmitKYCResultCommand } from "../../../application/commands/definitions/index.js";
import { IDatacapAllocatorRepository } from "../../../domain/datacap-allocator.js";
export declare class SubmitKYCResultCommandHandler implements ICommandHandler<SubmitKYCResultCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: SubmitKYCResultCommand): Promise<void>;
}
export declare class StartPhaseCommandHandler implements ICommandHandler<StartPhaseCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: StartPhaseCommand): Promise<void>;
}
export declare class CompletePhaseCommandHandler implements ICommandHandler<CompletePhaseCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: CompletePhaseCommand): Promise<void>;
}
export declare class StartKYCCommandHandler implements ICommandHandler<StartKYCCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: StartKYCCommand): Promise<void>;
}
export declare class ApproveKYCCommandHandler implements ICommandHandler<ApproveKYCCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: ApproveKYCCommand): Promise<void>;
}
export declare class RejectKYCCommandHandler implements ICommandHandler<RejectKYCCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: RejectKYCCommand): Promise<void>;
}
