import { IEventHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";
import { Db } from "mongodb";

import { AllocatorApplied } from "@src/domain/events";
import { TYPES } from "@src/types";
import { CommandBus } from "@src/infrastructure/command-bus";
import { UpdateApplicationPullRequestCommand } from "@src/application/commands/definitions/update-application-pr";
import { DatacapAllocatorPhase, DatacapAllocatorPhaseStatus } from "@src/domain/datacap-allocator";

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
      firstName: event.firstname,
      lastName: event.lastname,
      email: event.email,
      githubId: event.githubId,
      currentPosition: event.currentPosition,
      status: {
        phase: DatacapAllocatorPhase.KYC,
        phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
      }
    });

    const result = await this._commandBus.send(
      new UpdateApplicationPullRequestCommand(allocatorId)
    );
    console.log(`Created PR for allocator ${allocatorId}: ${result}`);
  }
}
