import { Command } from "@filecoin-plus/core";
export declare class UpdateApplicationPullRequestCommand extends Command {
    readonly allocatorId: string;
    constructor(allocatorId: string);
}
