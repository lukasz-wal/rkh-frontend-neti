import { Command, ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import {
  DatacapAllocator,
  IDatacapAllocatorRepository,
} from "@src/domain/datacap-allocator";
import { TYPES } from "@src/types";

export class CreateApplicationCommand extends Command {
  public readonly applicationNumber: number;
  public readonly allocatorPathwayName: string;
  public readonly organizationName: string;
  public readonly onChainAddress: string;
  public readonly githubUsername: string;
  public readonly country: string;
  public readonly region: string;
  public readonly type: string;
  public readonly datacap: number;

  /**
   * Creates a new CreateApplicationCommand instance.
   * @param data - Partial data to initialize the command.
   */
  constructor(data: Partial<CreateApplicationCommand>) {
    super();
    Object.assign(this, data);
  }
}

@injectable()
export class CreateApplicationCommandHandler
  implements ICommandHandler<CreateApplicationCommand>
{
  commandToHandle: string = CreateApplicationCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: CreateApplicationCommand): Promise<{ guid: string }> {
    const allocator: DatacapAllocator = new DatacapAllocator(
      command.guid,
      command.applicationNumber,
      command.allocatorPathwayName,
      command.organizationName,
      command.onChainAddress,
      command.githubUsername,
      command.country,
      command.region,
      command.type,
      command.datacap
    );

    this._repository.save(allocator, -1);

    return { guid: command.guid };
  }
}
