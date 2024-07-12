import { Command } from "@filecoin-plus/core";
import { DatacapAllocatorPhaseStatus } from "@src/domain/datacap-allocator";


export class SetGovernanceReviewStatusCommand extends Command {
    constructor(
        public readonly allocatorId: string,
        public readonly status: DatacapAllocatorPhaseStatus
    ) {
        super();
    }
}