import { ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import {
    DatacapAllocatorPhase,
    IDatacapAllocatorRepository,
  } from "@src/domain/datacap-allocator";
import { KYCApprovedData, KYCRejectedData } from "@src/domain/kyc";
import { TYPES } from "@src/types";

import { PhaseResult, SubmitPhaseResultCommand } from "./common";

export class SubmitKYCResultCommand extends SubmitPhaseResultCommand<
  KYCApprovedData,
  KYCRejectedData
> {
  constructor(
    allocatorId: string,
    result: PhaseResult<KYCApprovedData, KYCRejectedData>
  ) {
    super(allocatorId, DatacapAllocatorPhase.KYC, result);
  }
}

@injectable()
export class SubmitKYCResultCommandHandler
  implements ICommandHandler<SubmitKYCResultCommand>
{
  commandToHandle: string = SubmitKYCResultCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: SubmitKYCResultCommand): Promise<void> {
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with id ${command.allocatorId} not found`);
    }

    command.result.status === "approved"
      ? allocator.approveKYC(command.result.data)
      : allocator.rejectKYC(command.result.data);

    this._repository.save(allocator, allocator.version);
  }
}