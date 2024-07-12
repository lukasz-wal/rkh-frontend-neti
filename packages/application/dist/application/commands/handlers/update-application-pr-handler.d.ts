import { ICommandHandler } from "@filecoin-plus/core";
import { IGithubClient } from "../../../infrastructure/clients/github.js";
import { IDatacapAllocatorRepository } from "../../../domain/datacap-allocator.js";
import { UpdateApplicationPullRequestCommand } from "../definitions/update-application-pr.js";
export declare class UpdateApplicationPullRequestCommandHandler implements ICommandHandler<UpdateApplicationPullRequestCommand> {
    private readonly _repository;
    private readonly _githubClient;
    commandToHandle: string;
    constructor(_repository: IDatacapAllocatorRepository, _githubClient: IGithubClient);
    handle(command: UpdateApplicationPullRequestCommand): Promise<void>;
    private createPullRequest;
    private updatePullRequestMessage;
    private generateCommentMessage;
    private getKYCStatusMessage;
    private getDiscussionStatusMessage;
    private getRKHApprovalStatusMessage;
    private getStatusSpecificMessage;
}
