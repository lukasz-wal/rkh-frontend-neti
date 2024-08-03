import { Command, ICommandHandler } from "@filecoin-plus/core";
import { injectable } from "inversify";

export class UpdateRKHApprovalsCommand extends Command {
  constructor(
    public readonly txId: number,
    public readonly address: string,
    public readonly approvals: string[]
  ) {
    super();
  }
}

@injectable()
export class UpdateRKHApprovalsCommandHandler
  implements ICommandHandler<UpdateRKHApprovalsCommand>
{
  commandToHandle: string = UpdateRKHApprovalsCommand.name;

  constructor() {}

  async handle(command: UpdateRKHApprovalsCommand): Promise<void> {
    console.log("UpdateRKHApprovalsCommand", command);
  }
}