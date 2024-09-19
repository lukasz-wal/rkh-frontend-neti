import { Command, ICommandHandler, Logger } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import { DatacapAllocator, IDatacapAllocatorRepository } from "@src/domain/datacap-allocator";
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
    @inject(TYPES.Logger)
    private readonly _logger: Logger,
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: UpdateRKHApprovalsCommand): Promise<void> {
    let allocator: DatacapAllocator;
    try {
      allocator = await this._repository.getById(command.allocatorId);
    } catch (error) {
      return;
    }

    allocator.updateRKHApprovals(command.approvals);

    // Check if the approval threshold is met
    if (command.approvals.length >= allocator.rkhApprovalThreshold) {
      allocator.completeRKHApproval();
    }

    this._repository.save(allocator, allocator.version);
  }
}