import { Command } from "@filecoin-plus/core";
export declare class SetDatacapAllocatorKycStatusCommand extends Command {
    readonly allocatorId: string;
    readonly status: string;
    constructor(allocatorId: string, status: string);
}
