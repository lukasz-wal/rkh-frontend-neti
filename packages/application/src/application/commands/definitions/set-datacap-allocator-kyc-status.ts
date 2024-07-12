import { Command } from "@filecoin-plus/core";

export class SetDatacapAllocatorKycStatusCommand extends Command {
    constructor(
        public readonly allocatorId: string,
        public readonly status: string
    ) {
        super();
    }
}