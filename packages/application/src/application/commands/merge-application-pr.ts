import { Command, ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import { IDatacapAllocatorRepository } from "@src/domain/datacap-allocator";
import { IGithubClient } from "@src/infrastructure/clients/github";
import { TYPES } from "@src/types";
import config from "@src/config";

export class MergeApplicationPRCommand extends Command {
  constructor(public readonly allocatorId: string) {
    super();
  }
}

@injectable()
export class MergeApplicationPRCommandHandler
  implements ICommandHandler<MergeApplicationPRCommand>
{
  commandToHandle: string = MergeApplicationPRCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository,
    @inject(TYPES.GithubClient) private readonly _githubClient: IGithubClient
  ) {}

  async handle(command: MergeApplicationPRCommand): Promise<void> {
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with id ${command.allocatorId} not found`);
    }

    if (!allocator.applicationPullRequest) {
      throw new Error(`No pull request found for allocator ${command.allocatorId}`);
    }

    await this._githubClient.mergePullRequest(
      config.GITHUB_OWNER,
      config.GITHUB_REPO,
      allocator.applicationPullRequest.prNumber,
      "Automatically merged after RKH approval"
    );
  }
}