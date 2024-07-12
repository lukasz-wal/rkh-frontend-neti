var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Octokit } from "@octokit/rest";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types.js";
/**
 * Implements IGithubClient using the Octokit library.
 */
let GithubClient = class GithubClient {
    config;
    octokit;
    constructor(config) {
        this.config = config;
        this.octokit = new Octokit({ auth: config.authToken });
    }
    async createBranch(owner, repo, branchName, baseBranch) {
        // Get the latest commit SHA of the base branch.
        const sha = await this.getReferenceHash(owner, repo, baseBranch);
        // Create a new branch with the latest commit SHA.
        const { data } = await this.octokit.git.createRef({
            owner: owner,
            repo: repo,
            ref: `refs/heads/${branchName}`,
            sha: sha,
        });
        return data;
    }
    async createPullRequest(owner, repo, title, body, head, base, files) {
        // Create or update files in the branch
        for (const file of files) {
            await this.octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: file.path,
                message: `Add/update ${file.path}`,
                content: Buffer.from(file.content).toString("base64"),
                branch: head,
            });
        }
        // Create the pull request
        const { data } = await this.octokit.pulls.create({
            owner,
            repo,
            title,
            body,
            head,
            base,
        });
        return data;
    }
    async updatePullRequest(owner, repo, pullNumber, title, body) {
        const updateParams = {
            owner,
            repo,
            pull_number: pullNumber,
        };
        if (title)
            updateParams.title = title;
        if (body)
            updateParams.body = body;
        const { data } = await this.octokit.pulls.update(updateParams);
        return data;
    }
    async replyToPullRequest(owner, repo, pullNumber, body) {
        const { data } = await this.octokit.pulls.createReview({
            owner,
            repo,
            pull_number: pullNumber,
            body,
            event: "COMMENT",
        });
        return data;
    }
    async getReferenceHash(owner, repo, branch) {
        const { data } = await this.octokit.git.getRef({
            owner: owner,
            repo: repo,
            ref: `heads/${branch}`,
        });
        return data.object.sha;
    }
};
GithubClient = __decorate([
    injectable(),
    __param(0, inject(TYPES.GithubClientConfig)),
    __metadata("design:paramtypes", [Object])
], GithubClient);
export { GithubClient };
