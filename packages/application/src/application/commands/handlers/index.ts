import { ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import {
  ApproveKYCCommand,
  CompletePhaseCommand,
  RejectKYCCommand,
  StartKYCCommand,
  StartPhaseCommand,
  SubmitKYCResultCommand,
} from "@src/application/commands/definitions";
import {
  DatacapAllocatorPhase,
  IDatacapAllocatorRepository,
} from "@src/domain/datacap-allocator";
import { TYPES } from "@src/types";

// V3
@injectable()
export class SubmitKYCResultCommandHandler
  implements ICommandHandler<SubmitKYCResultCommand>
{
  commandToHandle: string = SubmitKYCResultCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: SubmitKYCResultCommand): Promise<void> {
    console.log("SubmitKYCResultCommandHandler", command);
    
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with id ${command.allocatorId} not found`);
    }

    command.result.status === "approved"
      ? allocator.approveKYC()
      : allocator.rejectKYC();

    this._repository.save(allocator, allocator.version);
  }
}

// V2

@injectable()
export class StartPhaseCommandHandler
  implements ICommandHandler<StartPhaseCommand>
{
  commandToHandle: string = StartPhaseCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: StartPhaseCommand): Promise<void> {
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with id ${command.allocatorId} not found`);
    }

    switch (command.phase) {
      // case DatacapAllocatorPhase.SUBMISSION:
      //   allocator.startSubmission();
      //   break;

      case DatacapAllocatorPhase.KYC:
        allocator.startKYC();
        break;

      case DatacapAllocatorPhase.GOVERNANCE_REVIEW:
        allocator.startGovernanceReview();
        break;

      // case DatacapAllocatorPhase.RKH_APPROVAL:
      //   allocator.startRKHApproval();
      //   break;
      //
      // case DatacapAllocatorPhase.DATA_CAP_GRANT:
      //   allocator.startDataCapGrant();
      //   break;

      default:
        throw new Error(`Unknown phase: ${command.phase}`);
    }

    this._repository.save(allocator, allocator.version);
  }
}

@injectable()
export class CompletePhaseCommandHandler
  implements ICommandHandler<CompletePhaseCommand>
{
  commandToHandle: string = CompletePhaseCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: CompletePhaseCommand): Promise<void> {
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with id ${command.allocatorId} not found`);
    }

    switch (command.phase) {
      case DatacapAllocatorPhase.KYC:
        command.data.result === "approved"
          ? allocator.approveKYC()
          : allocator.rejectKYC();
        break;

      case DatacapAllocatorPhase.GOVERNANCE_REVIEW:
        command.data.result === "approved"
          ? allocator.approveGovernanceReview()
          : allocator.rejectGovernanceReview();
        break;

      default:
        throw new Error(`Unknown phase: ${command.phase}`);
    }

    this._repository.save(allocator, allocator.version);
  }
}

// V1

@injectable()
export class StartKYCCommandHandler
  implements ICommandHandler<StartKYCCommand>
{
  commandToHandle: string = StartKYCCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: StartKYCCommand): Promise<void> {
    const application = await this._repository.getById(command.applicationId);
    if (!application) {
      throw new Error(`Application with id ${command.applicationId} not found`);
    }

    application.startKYC();
    this._repository.save(application, application.version);
  }
}

@injectable()
export class ApproveKYCCommandHandler
  implements ICommandHandler<ApproveKYCCommand>
{
  commandToHandle: string = ApproveKYCCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: ApproveKYCCommand): Promise<void> {
    const application = await this._repository.getById(command.applicationId);
    if (!application) {
      throw new Error(`Application with id ${command.applicationId} not found`);
    }

    application.approveKYC();
    this._repository.save(application, application.version);
  }
}

@injectable()
export class RejectKYCCommandHandler
  implements ICommandHandler<RejectKYCCommand>
{
  commandToHandle: string = RejectKYCCommand.name;

  constructor(
    @inject(TYPES.DatacapAllocatorRepository)
    private readonly _repository: IDatacapAllocatorRepository
  ) {}

  async handle(command: RejectKYCCommand): Promise<void> {
    const application = await this._repository.getById(command.applicationId);
    if (!application) {
      throw new Error(`Application with id ${command.applicationId} not found`);
    }

    application.rejectKYC();
    this._repository.save(application, application.version);
  }
}
