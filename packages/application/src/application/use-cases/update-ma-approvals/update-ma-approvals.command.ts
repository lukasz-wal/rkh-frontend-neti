import { Command, ICommandHandler, Logger } from '@filecoin-plus/core'
import { inject, injectable } from 'inversify'
import { DatacapAllocator, IDatacapAllocatorRepository } from '@src/domain/application/application'
import { TYPES } from '@src/types'

export class UpdateMetaAllocatorApprovalsCommand extends Command {
    constructor(
        public readonly allocatorId: string,
        public readonly blockNumber: number,
        public readonly txHash: string,
    ) {
        super()
    }
}

@injectable()
export class UpdateMetaAllocatorApprovalsCommandHandler implements ICommandHandler<UpdateMetaAllocatorApprovalsCommand> {
    commandToHandle: string = UpdateMetaAllocatorApprovalsCommand.name

constructor(
        @inject(TYPES.Logger)
        private readonly _logger: Logger,
        @inject(TYPES.DatacapAllocatorRepository)
        private readonly _repository: IDatacapAllocatorRepository,
    ) { }

    async handle(command: UpdateMetaAllocatorApprovalsCommand): Promise<void> {
        let allocator: DatacapAllocator
        try {
            allocator = await this._repository.getById(command.allocatorId)
        } catch (error) {
            this._logger.error(error)
            return
        }
        allocator.completeMetaAllocatorApproval(
            command.blockNumber,
            command.txHash,
        )
        this._repository.save(allocator, -1)
    }

}
