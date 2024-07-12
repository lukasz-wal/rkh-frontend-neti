import { Container } from "inversify";
import { infrastructureModule } from "./infrastructure/module.js";
import { CreateDatacapAllocatorCommandHandler } from "./application/commands/handlers/create-datacap-allocator-handler.js";
import { AllocatorAppliedEventHandler } from "./application/events/handlers/allocator-applied-handler.js";
import { TYPES } from "./types.js";
import { SetDatacapAllocatorKycStatusCommandHandler } from "./application/commands/handlers/set-datacap-allocator-kyc-status-handler.js";
import { UpdateApplicationPullRequestCommandHandler } from "./application/commands/handlers/update-application-pr-handler.js";
import { GetDatacapAllocatorsQueryHandler } from "./application/queries/handlers/get-datacap-allocators-query-handler.js";
import { SetGovernanceReviewStatusCommandHandler } from "./application/commands/handlers/set-governance-review-status-handler.js";
import { ApproveKYCCommandHandler, CompletePhaseCommandHandler, RejectKYCCommandHandler, StartKYCCommandHandler, StartPhaseCommandHandler, SubmitKYCResultCommandHandler, } from "./application/commands/handlers/index.js";
import { GovernanceReviewApprovedEventHandler, GovernanceReviewRejectedEventHandler, GovernanceReviewStartedEventHandler, KYCApprovedEventHandler, KYCRejectedEventHandler, KYCStartedEventHandler, } from "./application/events/handlers/index.js";
export const initialize = async () => {
    const container = new Container();
    await container.loadAsync(infrastructureModule);
    // const logger = createWinstonLogger('filecoin-plus-datacap-allocator');
    container
        .bind(TYPES.Event)
        .to(AllocatorAppliedEventHandler);
    // TODO: V1 Bind KYC events to their handlers
    container
        .bind(TYPES.Event)
        .to(KYCStartedEventHandler);
    container
        .bind(TYPES.Event)
        .to(KYCApprovedEventHandler);
    container
        .bind(TYPES.Event)
        .to(KYCRejectedEventHandler);
    // TODO: V1 Bind Governance events to their handlers
    container
        .bind(TYPES.Event)
        .to(GovernanceReviewStartedEventHandler);
    container
        .bind(TYPES.Event)
        .to(GovernanceReviewApprovedEventHandler);
    container
        .bind(TYPES.Event)
        .to(GovernanceReviewRejectedEventHandler);
    container
        .bind(TYPES.CommandHandler)
        .to(CreateDatacapAllocatorCommandHandler);
    container
        .bind(TYPES.CommandHandler)
        .to(SubmitKYCResultCommandHandler);
    container
        .bind(TYPES.CommandHandler)
        .to(StartPhaseCommandHandler);
    container
        .bind(TYPES.CommandHandler)
        .to(CompletePhaseCommandHandler);
    // TODO: REMOVE THIS
    container
        .bind(TYPES.CommandHandler)
        .to(SetDatacapAllocatorKycStatusCommandHandler);
    // TODO: KEEP THIS
    container
        .bind(TYPES.CommandHandler)
        .to(StartKYCCommandHandler);
    container
        .bind(TYPES.CommandHandler)
        .to(ApproveKYCCommandHandler);
    container
        .bind(TYPES.CommandHandler)
        .to(RejectKYCCommandHandler);
    container
        .bind(TYPES.CommandHandler)
        .to(SetGovernanceReviewStatusCommandHandler);
    container
        .bind(TYPES.CommandHandler)
        .to(UpdateApplicationPullRequestCommandHandler);
    const commandBus = container.get(TYPES.CommandBus);
    container
        .getAll(TYPES.CommandHandler)
        .forEach((handler) => {
        commandBus.registerHandler(handler);
    });
    container
        .bind(TYPES.QueryHandler)
        .to(GetDatacapAllocatorsQueryHandler);
    const queryBus = container.get(TYPES.QueryBus);
    container
        .getAll(TYPES.QueryHandler)
        .forEach((handler) => {
        queryBus.registerHandler(handler);
    });
    return container;
};
