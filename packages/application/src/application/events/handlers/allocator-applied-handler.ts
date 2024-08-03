import { IEventHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";
import { Db } from "mongodb";

import { AllocatorApplied } from "@src/domain/events";
import { TYPES } from "@src/types";
import { CommandBus } from "@src/infrastructure/command-bus";
import { DatacapAllocatorPhase, DatacapAllocatorPhaseStatus } from "@src/domain/datacap-allocator";
import { UpdateGithubBranchCommand } from "@src/application/commands";

@injectable()
export class AllocatorAppliedEventHandler
  implements IEventHandler<AllocatorApplied>
{
  public event = AllocatorApplied.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: CommandBus,
    @inject(TYPES.Db) private readonly _db: Db
  ) {}

  async handle(event: AllocatorApplied) {
    // Insert allocator data into the database
    const allocatorId = event.guid;
    await this._db.collection("datacapAllocators").insertOne({
      id: allocatorId,
      number: event.number,
      name: event.name,
      organization: event.organization,
      address: event.address,
      github: event.githubUsername,
      country: event.country,
      region: event.region,
      type: event.type,
      datacap: event.datacap,
      status: {
        phase: DatacapAllocatorPhase.KYC,
        phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
      },
      phases: {
        application: {
          number: event.number,
        },
      }
    });

    const result = await this._commandBus.send(
      new UpdateGithubBranchCommand(allocatorId)
    );
    console.log(`Created PR for allocator ${allocatorId}: ${result}`);
  }
}
