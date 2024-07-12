import { ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import { CreateDatacapAllocatorCommand } from "../definitions/create-datacap-allocator";
import {
  DatacapAllocator,
  IDatacapAllocatorRepository,
} from "@src/domain/datacap-allocator";
import { TYPES } from "@src/types";

@injectable()
export class CreateDatacapAllocatorCommandHandler
  implements ICommandHandler<CreateDatacapAllocatorCommand>
{
  commandToHandle: string = CreateDatacapAllocatorCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(
    command: CreateDatacapAllocatorCommand
  ): Promise<{ guid: string }> {
    const allocator: DatacapAllocator = new DatacapAllocator(
      command.guid,
      command.githubUserId,
      command.githubUserId,
      command.githubUserId,
      command.githubUserId,
      command.githubUserId
    );

    this._repository.save(allocator, -1);

    return { guid: command.guid };
  }
}
