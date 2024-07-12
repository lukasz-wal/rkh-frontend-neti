import { ICommandHandler } from "@filecoin-plus/core";
import { IDatacapAllocatorRepository } from "../../../domain/datacap-allocator.js";
import { SetGovernanceReviewStatusCommand } from "../definitions/set-governance-review-status.js";
export declare class SetGovernanceReviewStatusCommandHandler implements ICommandHandler<SetGovernanceReviewStatusCommand> {
    private readonly _repository;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository);
    handle(command: SetGovernanceReviewStatusCommand): Promise<void>;
}
