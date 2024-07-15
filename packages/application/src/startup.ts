import {
  ICommand,
  ICommandBus,
  ICommandHandler,
  IEventHandler,
  IQuery,
  IQueryBus,
  IQueryHandler,
} from "@filecoin-plus/core";
import { Container } from "inversify";

import { infrastructureModule } from "@src/infrastructure/module";
import { CreateDatacapAllocatorCommandHandler } from "@src/application/commands/handlers/create-datacap-allocator-handler";
import {
  AllocatorApplied,
  GovernanceReviewApproved,
  GovernanceReviewRejected,
  GovernanceReviewStarted,
  KYCApproved,
  KYCRejected,
  KYCStarted,
} from "@src/domain/events";
import { AllocatorAppliedEventHandler } from "@src/application/events/handlers/allocator-applied-handler";
import { TYPES } from "@src/types";
import { SetDatacapAllocatorKycStatusCommandHandler } from "./application/commands/handlers/set-datacap-allocator-kyc-status-handler";
import { UpdateApplicationPullRequestCommandHandler } from "./application/commands/handlers/update-application-pr-handler";
import { GetDatacapAllocatorsQueryHandler } from "./application/queries/handlers/get-datacap-allocators-query-handler";
import { SetGovernanceReviewStatusCommandHandler } from "./application/commands/handlers/set-governance-review-status-handler";
import {
  CompletePhaseCommandHandler,
  StartKYCCommandHandler,
  StartPhaseCommandHandler,
  SubmitKYCResultCommandHandler,
} from "./application/commands/handlers";
import {
  GovernanceReviewApprovedEventHandler,
  GovernanceReviewRejectedEventHandler,
  GovernanceReviewStartedEventHandler,
  KYCApprovedEventHandler,
  KYCRejectedEventHandler,
  KYCStartedEventHandler,
} from "./application/events/handlers";
import {
  CompletePhaseCommand,
  StartPhaseCommand,
} from "./application/commands/definitions";

export const initialize = async (): Promise<Container> => {
  const container = new Container();

  await container.loadAsync(infrastructureModule);

  // const logger = createWinstonLogger('filecoin-plus-datacap-allocator');

  container
    .bind<IEventHandler<AllocatorApplied>>(TYPES.Event)
    .to(AllocatorAppliedEventHandler);

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
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(CreateDatacapAllocatorCommandHandler);

    container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(SubmitKYCResultCommandHandler);

  container
    .bind<ICommandHandler<StartPhaseCommand>>(TYPES.CommandHandler)
    .to(StartPhaseCommandHandler);
  container
    .bind<ICommandHandler<CompletePhaseCommand>>(TYPES.CommandHandler)
    .to(CompletePhaseCommandHandler);

  // TODO: REMOVE THIS
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(SetDatacapAllocatorKycStatusCommandHandler);
  // TODO: KEEP THIS
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(StartKYCCommandHandler);
  
  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(SetGovernanceReviewStatusCommandHandler);

  container
    .bind<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .to(UpdateApplicationPullRequestCommandHandler);

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
