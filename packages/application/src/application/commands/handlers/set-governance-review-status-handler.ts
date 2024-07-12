import { ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";
import { TYPES } from "@src/types";
import {
  DatacapAllocatorPhaseStatus,
  IDatacapAllocatorRepository,
} from "@src/domain/datacap-allocator";
import { SetGovernanceReviewStatusCommand } from "../definitions/set-governance-review-status";

@injectable()
export class SetGovernanceReviewStatusCommandHandler
  implements ICommandHandler<SetGovernanceReviewStatusCommand>
{
  commandToHandle: string = SetGovernanceReviewStatusCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: SetGovernanceReviewStatusCommand): Promise<void> {
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(
        `Datacap allocator with id ${command.allocatorId} not found`
      );
    }

    switch (command.status) {
      case DatacapAllocatorPhaseStatus.IN_PROGRESS:
        allocator.startGovernanceReview();
        break;
      case DatacapAllocatorPhaseStatus.COMPLETED:
        allocator.completeGovernanceReview();
        break;
      default:
        throw new Error(`Invalid governance review status ${command.status}`);
    }

    this._repository.save(allocator, allocator.version);
  }
}
