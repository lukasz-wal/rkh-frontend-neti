import { Command, ICommandHandler, Logger } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import { ILotusClient } from "@src/infrastructure/clients/lotus";
import {
  DatacapAllocator,
  IDatacapAllocatorRepository,
} from "@src/domain/datacap-allocator";
import { TYPES } from "@src/types";

type Result<T> = {
  success: boolean;
  data?: T;
  error?: Error;
};

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
  public readonly targetClients: string[];
  public readonly dataTypes: string[];
  public readonly requiredReplicas: string;
  public readonly requiredOperators: string;
  public readonly standardizedAllocations: string;

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
    @inject(TYPES.Logger)
    private readonly logger: Logger,
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly repository: IDatacapAllocatorRepository,
    @inject(TYPES.LotusClient)
    private readonly lotusClient: ILotusClient
  ) {}

  async handle(
    command: CreateApplicationCommand
  ): Promise<Result<{ guid: string }>> {
    try {
      // Convert the on-chain address to an actor ID
      const allocatorId = await this.lotusClient.getActorId(
        command.onChainAddress
      );

      // Create a new datacap allocator
      const allocator: DatacapAllocator = new DatacapAllocator(
        allocatorId,
        command.applicationNumber,
        command.allocatorPathwayName,
        command.organizationName,
        command.onChainAddress,
        command.githubUsername,
        command.country,
        command.region,
        command.type,
        command.datacap,
        command.targetClients,
        command.dataTypes,
        command.requiredReplicas,
        command.requiredOperators,
        command.standardizedAllocations
      );

      this.repository.save(allocator, -1);

      return {
        success: true,
        data: { guid: command.guid },
      };
    } catch (error: any) {
      this.logger.error(
        "Error in CreateApplicationCommandHandler:",
        error.message
      );
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }
}
