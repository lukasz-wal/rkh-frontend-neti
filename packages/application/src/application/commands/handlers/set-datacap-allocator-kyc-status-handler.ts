import { ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";
import { SetDatacapAllocatorKycStatusCommand } from "../definitions/set-datacap-allocator-kyc-status";
import { TYPES } from "@src/types";
import { IDatacapAllocatorRepository } from "@src/domain/datacap-allocator";

@injectable()
export class SetDatacapAllocatorKycStatusCommandHandler
  implements ICommandHandler<SetDatacapAllocatorKycStatusCommand>
{
  commandToHandle: string = SetDatacapAllocatorKycStatusCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(
    command: SetDatacapAllocatorKycStatusCommand
  ): Promise<{ guid: string }> {
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Datacap allocator with id ${command.allocatorId} not found`);
    }
    
    allocator.completeKYC();
    this._repository.save(allocator, allocator.version);

    return { guid: command.guid };
  }
}
