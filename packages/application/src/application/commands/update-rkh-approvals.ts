import { Command, ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import { IDatacapAllocatorRepository } from "@src/domain/datacap-allocator";
import { TYPES } from "@src/types";

export class UpdateRKHApprovalsCommand extends Command {
  constructor(
    public readonly allocatorId: string,
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

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: UpdateRKHApprovalsCommand): Promise<void> {
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with id ${command.allocatorId} not found`);
    }

    allocator.updateRKHApprovals(command.approvals);
  }
}