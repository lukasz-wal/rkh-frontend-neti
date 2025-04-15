import { Command, ICommandHandler, Logger } from '@filecoin-plus/core'
import { inject, injectable } from 'inversify'

import { ApplicationAllocator } from '@src/domain/application/application'
import { ApplicationInstruction, IDatacapAllocatorRepository } from '@src/domain/application/application'
import { TYPES } from '@src/types'
import { ApplicationPullRequestFile } from '@src/application/services/pull-request.types'

export class EditApplicationCommand extends Command {
  public readonly applicationId: string
  public readonly file: ApplicationPullRequestFile
  /**
   * Creates a new EditApplicationCommand instance.
   * @param applicationId - The application id.
   * @param file - The application pull request file.
   */
  constructor({
    applicationId,
    file,
  }: {
    applicationId: string
    file: ApplicationPullRequestFile
  }) {
    super()
    this.applicationId = applicationId
    this.file = file
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
    prevApplicationInstructions: ApplicationInstruction[],
    currApplicationInstructions: ApplicationInstruction[],
  ): ApplicationInstruction[] {

    if (!prevApplicationInstructions) {
      prevApplicationInstructions = []
    }
    // If currApplicationInstruction is empty default to prevApplicationInstruction
    if (!currApplicationInstructions) {
      return prevApplicationInstructions
    }
    // Ensure instruction arrays length >= previous instruction arrays length
    if (currApplicationInstructions.length < prevApplicationInstructions.length) {
      return prevApplicationInstructions
    }
    // Ensure each method and amount is valid
    const validMethods = [ApplicationAllocator.META_ALLOCATOR, ApplicationAllocator.RKH_ALLOCATOR];
    for (let currApplicationInstruction of currApplicationInstructions) {
      let currInstructionMethod: string
      let currInstructionAmount: number
      try {
        currInstructionMethod = currApplicationInstruction.method
        currInstructionAmount = currApplicationInstruction.datacap_amount
      } catch (error) {
        return prevApplicationInstructions
      }
      if (!validMethods.includes(currInstructionMethod as ApplicationAllocator)) {
        return prevApplicationInstructions
      }
      if (!Number.isInteger(currInstructionAmount) || currInstructionAmount <= 0) {
        return prevApplicationInstructions
      }
    }

    return currApplicationInstructions

  }

  async handle(command: EditApplicationCommand): Promise<void> {
    this.logger.info(`Handling edit application command for application ${command.file.application_number}`)
    const application = await this.repository.getById(command.applicationId)
    if (!application) {
      this.logger.error('Application not found')
      throw new Error('Application not found')
    }

    const prevApplicationInstructions = application.applicationInstructions
    const currApplicationInstructions = Object.entries(command.file.LifeCycle).map(([_, value]) => ({
      method: ApplicationAllocator.META_ALLOCATOR,
      timestamp: parseInt(value[0]),
      datacap_amount: parseInt(value[1]),
    }))
    console.log('prevApplicationInstructions', prevApplicationInstructions)
    console.log('currApplicationInstructions', currApplicationInstructions)
    const validApplicationInstructions = this.ensureValidApplicationInstruction(prevApplicationInstructions, currApplicationInstructions)
    console.log('validApplicationInstructions', validApplicationInstructions)

    await application.edit(command.file)
    this.logger.info(`Application ${command.applicationId} edited successfully`)

    await this.repository.save(application, -1)
  }
}
