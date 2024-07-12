import { components } from "@octokit/openapi-types";
export type Branch = components["schemas"]["git-ref"];
export type PullRequest = components["schemas"]["pull-request"];
export type PullRequestReview = components["schemas"]["pull-request-review"];
export interface IGithubClient {
    createBranch(owner: string, repo: string, branchName: string, baseBranch: string): Promise<Branch>;
    createPullRequest(owner: string, repo: string, title: string, body: string, head: string, base: string, files: {
        path: string;
        content: string;
    }[]): Promise<PullRequest>;
    updatePullRequest(owner: string, repo: string, pullNumber: number, title?: string, body?: string): Promise<PullRequest>;
    replyToPullRequest(owner: string, repo: string, pullNumber: number, body: string): Promise<PullRequestReview>;
}
/**
 * Configuration options for GithubClient
 */
export interface GithubClientConfig {
    authToken: string;
}
/**
 * Implements IGithubClient using the Octokit library.
 */
export declare class GithubClient implements IGithubClient {
    private readonly config;
    private octokit;
    constructor(config: GithubClientConfig);
    createBranch(owner: string, repo: string, branchName: string, baseBranch: string): Promise<Branch>;
    createPullRequest(owner: string, repo: string, title: string, body: string, head: string, base: string, files: {
        path: string;
        content: string;
    }[]): Promise<PullRequest>;
    updatePullRequest(owner: string, repo: string, pullNumber: number, title?: string, body?: string): Promise<PullRequest>;
    replyToPullRequest(owner: string, repo: string, pullNumber: number, body: string): Promise<PullRequestReview>;
    private getReferenceHash;
}
