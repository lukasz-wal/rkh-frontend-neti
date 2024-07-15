import { ICommandHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";

import {
  CompletePhaseCommand,
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
    const allocator = await this._repository.getById(command.allocatorId);
    if (!allocator) {
      throw new Error(`Allocator with id ${command.allocatorId} not found`);
    }

    command.result.status === "approved"
      ? allocator.approveKYC(command.result.data)
      : allocator.rejectKYC(command.result.data);

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
        allocator.approveKYC({
          id: "f49d3a83-3dac-464a-b97a-bd8f7f1fa9b9",
          kycInquiryId: allocator.guid,
          createdAt: "2023-10-03T10:31:51.303476Z",
          tenantId: "6098ca37-d11e-4b66-9344-3837dd3852f9",
          documentId: "f915626947e64baf9a1454c6e662ecd1",
          documentType: "GB_DrivingLicense_2015",
          platform: "iOS",
          browser: "Mozilla/5.0",
          scoreDocumentTotal: 0.9968421,
          scoreBiometricLifeProof: 0.90229774,
          scoreBiometricSelfie: 0.99972534,
          scoreBiometricPhotoId: 0.99972534,
          scoreBiometricDuplicateAttack: 0.55731136,
          processCode: "ProcessCompleted",
          processMessage: "The process has been successfully completed",
        });
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
