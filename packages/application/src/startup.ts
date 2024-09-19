import {
  ICommand,
  ICommandBus,
  ICommandHandler,
  IEventHandler,
  IQuery,
  IQueryBus,
  IQueryHandler,
  Logger,
  createWinstonLogger,
} from "@filecoin-plus/core";
import { Container } from "inversify";

import { infrastructureModule } from "@src/infrastructure/module";
import {
  AllocatorApplied,
  ApplicationSubmitted,
  GovernanceReviewApproved,
  GovernanceReviewRejected,
  GovernanceReviewStarted,
  KYCApproved,
  KYCRejected,
  KYCStarted,
  RKHApprovalCompleted,
} from "@src/domain/events";
import { AllocatorAppliedEventHandler } from "@src/application/events/handlers/allocator-applied-handler";
import { TYPES } from "@src/types";
import {
  ApplicationSubmittedEventHandler,
  GovernanceReviewApprovedEventHandler,
  GovernanceReviewRejectedEventHandler,
  GovernanceReviewStartedEventHandler,
  KYCApprovedEventHandler,
  KYCRejectedEventHandler,
  KYCStartedEventHandler,
  RKHApprovalCompletedEventHandler,
} from "./application/events/handlers";
import { UpdateRKHApprovalsCommandHandler } from "./application/commands/update-rkh-approvals";
import {
  CreateApplicationCommandHandler,
  SubmitKYCResultCommandHandler,
  UpdateDatacapAllocationCommandHandler,
  UpdateGithubBranchCommandHandler,
} from "./application/commands";
import { GetDatacapAllocatorsQueryHandler } from "./application/queries/get-datacap-allocators";
import { SubmitGovernanceReviewResultCommandHandler } from "./application/commands/submit-governance-review";

export const initialize = async (): Promise<Container> => {
  const container = new Container();

  await container.loadAsync(infrastructureModule);

  // Logger
  const logger = createWinstonLogger("filecoin-plus-backend");
  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);

  container
    .bind<IEventHandler<AllocatorApplied>>(TYPES.Event)
    .to(AllocatorAppliedEventHandler);

  container
    .bind<IEventHandler<ApplicationSubmitted>>(TYPES.Event)
    .to(ApplicationSubmittedEventHandler);

  // TODO: V1 Bind KYC events to their handlers
  container
    .bind<IEventHandler<KYCStarted>>(TYPES.Event)
    .to(KYCStartedEventHandler);
  container
    .bind<IEventHandler<KYCApproved>>(TYPES.Event)
    .to(KYCApprovedEventHandler);
  container
    .bind<IEventHandler<KYCRejected>>(TYPES.Event)
    .to(KYCRejectedEventHandler);

  // TODO: V1 Bind Governance events to their handlers
  container
    .bind<IEventHandler<GovernanceReviewStarted>>(TYPES.Event)
    .to(GovernanceReviewStartedEventHandler);
  container
    .bind<IEventHandler<GovernanceReviewApproved>>(TYPES.Event)
    .to(GovernanceReviewApprovedEventHandler);
  container
    .bind<IEventHandler<GovernanceReviewRejected>>(TYPES.Event)
    .to(GovernanceReviewRejectedEventHandler);
  container
    .bind<IEventHandler<RKHApprovalCompleted>>(TYPES.Event)
    .to(RKHApprovalCompletedEventHandler);

  container
    .bind<IEventHandler<RKHApprovalCompleted>>(TYPES.Event)
    .to(RKHApprovalCompletedEventHandler);

  // Commands
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(CreateApplicationCommandHandler);
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(SubmitKYCResultCommandHandler);
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(SubmitGovernanceReviewResultCommandHandler);
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(UpdateRKHApprovalsCommandHandler);
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(UpdateDatacapAllocationCommandHandler);
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(UpdateGithubBranchCommandHandler);

  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
  container
    .getAll<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .forEach((handler: ICommandHandler<ICommand>) => {
      commandBus.registerHandler(handler);
    });

  container
    .bind<IQueryHandler<IQuery>>(TYPES.QueryHandler)
    .to(GetDatacapAllocatorsQueryHandler);

  const queryBus = container.get<IQueryBus>(TYPES.QueryBus);
  container
    .getAll<IQueryHandler<IQuery>>(TYPES.QueryHandler)
    .forEach((handler: IQueryHandler<IQuery>) => {
      queryBus.registerHandler(handler);
    });  

  return container;
};
