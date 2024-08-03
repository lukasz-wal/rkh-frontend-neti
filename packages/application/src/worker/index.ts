import "reflect-metadata";

import { ICommandBus, IEventBus, Logger } from "@filecoin-plus/core";

import { RabbitMQEventBus } from "@src/infrastructure/event-bus/rabbitmq-event-bus";
import { initialize } from "@src/startup";
import { TYPES } from "@src/types";

import { subscribeApplicationSubmissions } from "./subscribe-application-submissions";
import { subscribeGovernanceReviews } from "./subscribe-governance-reviews";
import { subscribeRkhProposals } from "./subscribe-rkh-proposals";
import { subscribeRkhApprovals } from "./subscribe-rkh-approvals";


async function main() {
  const container = await initialize();

  // Get the logger from the container
  const logger = container.get<Logger>(TYPES.Logger);

  // Initialize RabbitMQ
  const eventBus = container.get<IEventBus>(TYPES.EventBus) as RabbitMQEventBus;
  try {
    await eventBus.init();
    logger.info("RabbitMQ initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize RabbitMQ", { error });
    process.exit(1);
  }

  // Start the subscriptions
  // await subscribeApplicationSubmissions(container);
  // await subscribeGovernanceReviews(container);
  // await subscribeRkhProposals(container);
  // await subscribeRkhApprovals(container);
}

main().catch((error) => {
  console.error("Unhandled error in worker:", error);
  process.exit(1);
});
