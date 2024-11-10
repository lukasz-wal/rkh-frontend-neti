import { Command, ICommandHandler, Logger } from '@filecoin-plus/core'
import { inject, injectable } from 'inversify'

import { ILotusClient } from '@src/infrastructure/clients/lotus'
import { TYPES } from '@src/types'
import { PullRequestService } from '@src/application/services/pull-request.service'
import { ApplicationInstruction, DatacapAllocator, IDatacapAllocatorRepository } from '@src/domain/application/application'

type Result<T> = {
  success: boolean
  data?: T
  error?: Error
}

export class CreateApplicationCommand extends Command {
  public readonly applicationId: string
  public readonly applicationNumber: number
  public readonly applicantName: string
  public readonly applicantLocation: string
  public readonly applicantGithubHandle: string
  public readonly applicantSlackHandle: string
  public readonly applicantAddress: string
  public readonly applicantOrgName: string
  public readonly applicantOrgAddresses: string[]
  public readonly allocationStandardizedAllocations: string[]
  public readonly allocationTargetClients: string[]
  public readonly allocationRequiredReplicas: string
  public readonly allocationRequiredStorageProviders: string
  public readonly allocationTooallocationTargetClientsling: string[]
  public readonly allocationTooling: string[]
  public readonly allocationDataTypes: string[]
  public readonly allocationProjected12MonthsUsage: string
  public readonly allocationBookkeepingRepo: string
  public readonly applicationInstructions: ApplicationInstruction[]
  public readonly type: string
  public readonly datacap: number
  public readonly allocatorMultisigAddress?: string

  /**
   * Creates a new CreateApplicationCommand instance.
   * @param data - Partial data to initialize the command.
   */
  constructor(data: Partial<CreateApplicationCommand>) {
    super()
    Object.assign(this, data)
  }
}

@injectable()
export class CreateApplicationCommandHandler implements ICommandHandler<CreateApplicationCommand> {
  commandToHandle: string = CreateApplicationCommand.name

  constructor(
    @inject(TYPES.Logger)
    private readonly logger: Logger,
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly repository: IDatacapAllocatorRepository,
    @inject(TYPES.LotusClient)
    private readonly lotusClient: ILotusClient,
    @inject(TYPES.PullRequestService)
    private readonly pullRequestService: PullRequestService,
  ) {}

  async handle(command: CreateApplicationCommand): Promise<Result<{ guid: string }>> {
    try {
      await this.repository.getById(command.applicationId)
      return {
        success: false,
        error: new Error('Application already exists'),
      }
    } catch (error) {}

    try {
      // Create a new datacap allocator
      const allocator: DatacapAllocator = DatacapAllocator.create({
        applicationId: command.applicationId,
        applicationNumber: command.applicationNumber,
        applicantName: command.applicantName,
        applicantLocation: command.applicantLocation,
        applicantGithubHandle: command.applicantGithubHandle,
        applicantSlackHandle: command.applicantSlackHandle,
        applicantAddress: command.applicantAddress,
        applicantOrgName: command.applicantOrgName,
        applicantOrgAddresses: command.applicantOrgAddresses,
        allocationStandardizedAllocations: command.allocationStandardizedAllocations,
        allocationTargetClients: command.allocationTargetClients,
        allocationRequiredReplicas: command.allocationRequiredReplicas,
        allocationRequiredStorageProviders: command.allocationRequiredStorageProviders,
        allocationTooling: command.allocationTooling,
        allocationDataTypes: command.allocationDataTypes,
        allocationProjected12MonthsUsage: command.allocationProjected12MonthsUsage,
        allocationBookkeepingRepo: command.allocationBookkeepingRepo,
        applicationInstructions: command.applicationInstructions || [],
        type: command.type,
        datacap: command.datacap,
      })

      if (command.allocatorMultisigAddress) {
        const actorId = await this.lotusClient.getActorId(command.allocatorMultisigAddress)
        allocator.setAllocatorMultisig(actorId, command.allocatorMultisigAddress, 2, ['s1', 's2'])
      }
      this.logger.info("Creating pull request...")

      const pullRequest = await this.pullRequestService.createPullRequest(allocator)
      allocator.setApplicationPullRequest(pullRequest.number, pullRequest.url, pullRequest.commentId)

      await this.repository.save(allocator, -1)

      return {
        success: true,
        data: { guid: command.guid },
      }
    } catch (error: any) {
      this.logger.error(error.message)
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    }
  }
}
