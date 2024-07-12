import { Command } from "@filecoin-plus/core";

export class UpdateApplicationPullRequestCommand extends Command {
  constructor(public readonly allocatorId: string) {
    super();
  }
}
