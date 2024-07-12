import { Command } from "@filecoin-plus/core";
export class SetGovernanceReviewStatusCommand extends Command {
    allocatorId;
    status;
    constructor(allocatorId, status) {
        super();
        this.allocatorId = allocatorId;
        this.status = status;
    }
}
