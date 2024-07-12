import { Command } from "@filecoin-plus/core";
export class UpdateApplicationPullRequestCommand extends Command {
    allocatorId;
    constructor(allocatorId) {
        super();
        this.allocatorId = allocatorId;
    }
}
