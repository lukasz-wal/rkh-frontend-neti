import { Command } from "@filecoin-plus/core";
import { DatacapAllocatorPhaseStatus } from "../../../domain/datacap-allocator.js";
export declare class SetGovernanceReviewStatusCommand extends Command {
    readonly allocatorId: string;
    readonly status: DatacapAllocatorPhaseStatus;
    constructor(allocatorId: string, status: DatacapAllocatorPhaseStatus);
}
