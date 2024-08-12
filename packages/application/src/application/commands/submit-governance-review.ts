import { ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import {
  DatacapAllocatorPhase,
  IDatacapAllocatorRepository,
} from "@src/domain/datacap-allocator";
import { TYPES } from "@src/types";

import { PhaseResult, SubmitPhaseResultCommand } from "./common";

type GovernanceReviewApprovedData = any;  // TODO
type GovernanceReviewRejectedData = any;  // TODO

export class SubmitGovernanceReviewResultCommand extends SubmitPhaseResultCommand<
  GovernanceReviewApprovedData,
  GovernanceReviewRejectedData
> {
  constructor(
    allocatorId: string,
    result: PhaseResult<
      GovernanceReviewApprovedData,
      GovernanceReviewRejectedData
    >
  ) {
    super(allocatorId, DatacapAllocatorPhase.KYC, result);
  }
}

@injectable()
export class SubmitGovernanceReviewResultCommandHandler
  implements ICommandHandler<SubmitGovernanceReviewResultCommand>
{
  commandToHandle: string = SubmitGovernanceReviewResultCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: SubmitGovernanceReviewResultCommand): Promise<void> {
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with id ${command.allocatorId} not found`);
    }

    command.result.status === "approved"
      ? allocator.approveGovernanceReview()
      : allocator.rejectGovernanceReview();

    this._repository.save(allocator, allocator.version);
  }
}
