import { Octokit } from "@octokit/rest";
import { components } from "@octokit/openapi-types";
import { inject, injectable } from "inversify";
import { TYPES } from "@src/types";

export type Branch = components["schemas"]["git-ref"];
export type PullRequest = components["schemas"]["pull-request"];
export type PullRequestReview = components["schemas"]["pull-request-review"];

export interface IGithubClient {
  createBranch(
    owner: string,
    repo: string,
    branchName: string,
    baseBranch: string
  ): Promise<Branch>;

  createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string,
    files: { path: string; content: string }[]
  ): Promise<PullRequest>;

  updatePullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    title?: string,
    body?: string
  ): Promise<PullRequest>;

  replyToPullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    body: string
  ): Promise<PullRequestReview>;
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
@injectable()
export class GithubClient implements IGithubClient {
  private octokit: Octokit;

  constructor(
    @inject(TYPES.GithubClientConfig)
    private readonly config: GithubClientConfig
  ) {
    this.octokit = new Octokit({ auth: config.authToken });
  }

  async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    baseBranch: string
  ): Promise<Branch> {
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

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string,
    files: { path: string; content: string }[]
  ): Promise<PullRequest> {
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

  async updatePullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    title?: string,
    body?: string
  ): Promise<PullRequest> {
    const updateParams: {
      owner: string;
      repo: string;
      pull_number: number;
      title?: string;
      body?: string;
    } = {
      owner,
      repo,
      pull_number: pullNumber,
    };

    if (title) updateParams.title = title;
    if (body) updateParams.body = body;

    const { data } = await this.octokit.pulls.update(updateParams);
    return data;
  }

  async replyToPullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    body: string
  ): Promise<PullRequestReview> {
    const { data } = await this.octokit.pulls.createReview({
      owner,
      repo,
      pull_number: pullNumber,
      body,
      event: "COMMENT",
    });

    return data;
  }

  private async getReferenceHash(
    owner: string,
    repo: string,
    branch: string
  ): Promise<string> {
    const { data } = await this.octokit.git.getRef({
      owner: owner,
      repo: repo,
      ref: `heads/${branch}`,
    });
    return data.object.sha;
  }
}
