import { ICommandBus, Logger } from "@filecoin-plus/core";
import dotenv from "dotenv";
import { Container } from "inversify";
import { Db } from "mongodb";

import { SubmitGovernanceReviewResultCommand } from "@src/application/commands/submit-governance-review";
import config from "@src/config";
import { IGithubClient } from "@src/infrastructure/clients/github";
import { TYPES } from "@src/types";
import { DatacapAllocator } from "@src/domain/datacap-allocator";

// Load environment variables
dotenv.config();

type GovernanceReviewer = {
  githubHandle: string;
  address?: string;
}

const GOVERNANCE_REVIEWERS = process.env.GOVERNANCE_REVIEWERS?.split(",") || [
  "asynctomatic",
];
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || "5000", 10);

export async function subscribeGovernanceReviews(container: Container) {
  const client = container.get<IGithubClient>(TYPES.GithubClient);
  const db = container.get<Db>(TYPES.Db);
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
  const logger = container.get<Logger>(TYPES.Logger);

  try {
    setInterval(
      () => processApplications(db, client, commandBus, logger),
      POLL_INTERVAL
    );
  } catch (error) {
    logger.error("Failed to initialize the application", { error });
    process.exit(1);
  }
}

/**
 * Processes all applications in the GOVERNANCE_REVIEW phase.
 * @param {Db} db - MongoDB database instance
 * @param {IGithubClient} client - GitHub client instance
 * @param {ICommandBus} commandBus - Command bus instance
 * @param {Logger} logger - Logger instance
 */
async function processApplications(
  db: Db,
  client: IGithubClient,
  commandBus: ICommandBus,
  logger: Logger
) {
  try {
    const applications = await fetchApplications(db, logger);

    for (const application of applications) {
      await processApplication(application, client, commandBus, logger);
    }
  } catch (error) {
    logger.error("Error processing applications", { error });
  }
}

/**
 * Fetches applications in the GOVERNANCE_REVIEW phase from the database.
 * @param {Db} db - MongoDB database instance
 * @param {Logger} logger - Logger instance
 * @returns {Promise<any[]>} Array of applications
 */
async function fetchApplications(db: Db, logger: Logger): Promise<any[]> {
  logger.info("Fetching applications in GOVERNANCE_REVIEW phase");
  const applications = await db
    .collection("datacapAllocators")
    .find({
      "status.phase": "GOVERNANCE_REVIEW",
    })
    .toArray();
  logger.info("Applications fetched", { count: applications.length });
  return applications;
}

/**
 * Processes a single application by fetching reviews and submitting the governance review if approved.
 * @param {any} application - The application to process
 * @param {IGithubClient} client - GitHub client instance
 * @param {ICommandBus} commandBus - Command bus instance
 * @param {Logger} logger - Logger instance
 */
async function processApplication(
  application: any,
  client: IGithubClient,
  commandBus: ICommandBus,
  logger: Logger
) {
  if (!application?.phases?.submission?.pullRequestCommentId) {
    logger.debug("Skipping application due to missing pullRequestCommentId", {
      applicationId: application.id,
    });
    return;
  }

  try {
    const reviews = await fetchReviews(client, logger, application);
    const approvedReview = findApprovedReview(reviews, logger, application.id);

    if (approvedReview) {
      await submitGovernanceReview(
        commandBus,
        application.id,
        approvedReview,
        logger
      );
    }
  } catch (error) {
    logger.error("Error processing application", {
      applicationId: application.id,
      error,
    });
  }
}

/**
 * Fetches reviews for a pull request from GitHub.
 * @param {IGithubClient} client - GitHub client instance
 * @param {Logger} logger - Logger instance
 * @param {any} application - The ID of the application being processed
 * @returns {Promise<any[]>} Array of reviews
 */
async function fetchReviews(
  client: IGithubClient,
  logger: Logger,
  application: any
): Promise<any[]> {
  logger.info("Fetching reviews", { application });
  
  const reviews = await client.getPullRequestReviews(
    config.GITHUB_OWNER,
    config.GITHUB_REPO,
    application.phases.submission.pullRequestNumber
  );
  logger.info("Reviews fetched", { application, count: reviews.length });
  return reviews;
}

/**
 * Finds an approved review from a governance reviewer.
 * @param {any[]} reviews - Array of reviews to search through
 * @param {Logger} logger - Logger instance
 * @param {string} applicationId - The ID of the application being processed
 * @returns {any | undefined} The approved review, or undefined if not found
 */
function findApprovedReview(
  reviews: any[],
  logger: Logger,
  applicationId: string
): any | undefined {
  const approvedReview = reviews.find(
    (review) =>
      review.state === "APPROVED" &&
      GOVERNANCE_REVIEWERS.includes(review?.user?.login as string)
  );

  if (approvedReview) {
    logger.info("Found approved review", { applicationId });
  } else {
    logger.info("No approved review found", { applicationId });
  }

  return approvedReview;
}

/**
 * Submits the governance review result for an application.
 * @param {ICommandBus} commandBus - Command bus instance
 * @param {string} applicationId - The ID of the application being processed
 * @param {any} review - The approved review to submit
 * @param {Logger} logger - Logger instance
 */
async function submitGovernanceReview(
  commandBus: ICommandBus,
  applicationId: string,
  review: any,
  logger: Logger
) {
  logger.info("Submitting governance review result", { applicationId });
  await commandBus.send(
    new SubmitGovernanceReviewResultCommand(applicationId, {
      status: "approved",
      data: review,
    })
  );
  logger.info("Governance review result submitted", { applicationId });
}
