import { Command, ICommandHandler, Logger } from '@filecoin-plus/core'
import { inject, injectable } from 'inversify'

import { IDatacapAllocatorRepository } from '@src/domain/application/application'
import { TYPES } from '@src/types'

export class EditApplicationCommand extends Command {
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
  public readonly allocationTooling: string[]
  public readonly allocationDataTypes: string[]
  public readonly allocationProjected12MonthsUsage: string
  public readonly allocationBookkeepingRepo: string

  /**
   * Creates a new EditApplicationCommand instance.
   * @param data - Partial data to initialize the command.
   */
  constructor(data: Partial<EditApplicationCommand>) {
    super()
    Object.assign(this, data)
  }
}

@injectable()
export class EditApplicationCommandHandler implements ICommandHandler<EditApplicationCommand> {
  commandToHandle: string = EditApplicationCommand.name

  constructor(
    @inject(TYPES.Logger)
    private readonly logger: Logger,
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly repository: IDatacapAllocatorRepository,
  ) {}

  async handle(command: EditApplicationCommand): Promise<void> {
    this.logger.info(`Handling edit application command for application ${command.applicationId}`)
    const application = await this.repository.getById(command.applicationId)
    if (!application) {
      this.logger.error('Application not found')
      throw new Error('Application not found')
    }

    await application.edit({
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
    })
    this.logger.info(`Application ${command.applicationId} edited successfully`)

    await this.repository.save(application, -1)
  }
}
