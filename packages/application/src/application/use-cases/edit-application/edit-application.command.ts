import { Command, ICommandHandler, Logger } from '@filecoin-plus/core'
import { inject, injectable } from 'inversify'
import { ApplicationAllocator } from '@src/domain/application/application'
import { ApplicationInstruction, IDatacapAllocatorRepository } from '@src/domain/application/application'
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
  // DONE xTODO: allocation instruction
  public readonly applicationInstructionMethod: string[]
  public readonly applicationInstructionAmount: number[]

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
  ) { }

  ensureValidApplicationInstruction(
    prevApplicationInstruction: ApplicationInstruction,
    currApplicationInstruction: ApplicationInstruction,
  ): ApplicationInstruction {

    if (!prevApplicationInstruction) {
      prevApplicationInstruction = { method: [], amount: [] }
    }

    // If currApplicationInstruction is empty default to prevApplicationInstruction
    if (!currApplicationInstruction) {
      return prevApplicationInstruction
    }

    // Ensure method and amount arrays have the same length:
    if (currApplicationInstruction.method.length !== currApplicationInstruction.amount.length) {
      return prevApplicationInstruction;
    }

    // Ensure instruction arrays length >= previous instruction arrays length
    if (currApplicationInstruction.method.length < prevApplicationInstruction.method.length) {
      return prevApplicationInstruction;
    }

    // Ensure each method is valid
    const validMethods = [ApplicationAllocator.META_ALLOCATOR, ApplicationAllocator.RKH_ALLOCATOR];
    for (let method of currApplicationInstruction.method) {
      if (!validMethods.includes(method as ApplicationAllocator)) {
        return prevApplicationInstruction;
      }
    }

    // Ensure each amount is a positive integer
    for (let amount of currApplicationInstruction.amount) {
      if (!Number.isInteger(amount) || amount <= 0) {
        return prevApplicationInstruction;
      }
    }

    return currApplicationInstruction
  }

  async handle(command: EditApplicationCommand): Promise<void> {
    this.logger.info(`Handling edit application command for application ${command.applicationId}`)
    const application = await this.repository.getById(command.applicationId)
    if (!application) {
      this.logger.error('Application not found')
      throw new Error('Application not found')
    }

    const prevApplicationInstruction = {
      method: application.applicationInstructionMethod,
      amount: application.applicationInstructionAmount,
    }
    const currApplicationInstruction = {
      method: command.applicationInstructionMethod,
      amount: command.applicationInstructionAmount
    }
    const validApplicationInstruction = this.ensureValidApplicationInstruction(prevApplicationInstruction, currApplicationInstruction)

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
      // DONE xTODO: allocation instruction
      applicationInstructionMethod: validApplicationInstruction.method,
      applicationInstructionAmount: validApplicationInstruction.amount,
    })
    this.logger.info(`Application ${command.applicationId} edited successfully`)

    await this.repository.save(application, -1)
  }
}
