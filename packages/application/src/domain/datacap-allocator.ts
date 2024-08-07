import {
  AggregateRoot,
  ApplicationError,
  IEventStore,
  IRepository,
} from "@filecoin-plus/core";
import { StatusCodes } from "http-status-codes";

import {
  AllocatorApplied,
  GovernanceReviewStarted,
  KYCStarted,
  KYCApproved,
  KYCRejected,
  GovernanceReviewApproved,
  GovernanceReviewRejected,
  ApplicationSubmitted,
  RKHApprovalStarted,
  RKHSignatureSubmitted,
  RKHApprovalApproved,
  RKHApprovalRejected,
} from "./events";
import { KYCApprovedData, KYCRejectedData } from "./kyc";

export interface IDatacapAllocatorRepository
  extends IRepository<DatacapAllocator> {}

export interface IDatacapAllocatorEventStore
  extends IEventStore<DatacapAllocator> {}

export enum DatacapAllocatorPhase {
  SUBMISSION = "SUBMISSION",
  KYC = "KYC",
  GOVERNANCE_REVIEW = "GOVERNANCE_REVIEW",
  RKH_APPROVAL = "RKH_APPROVAL",
  DATA_CAP_GRANT = "DATA_CAP_GRANT",
}

export enum DatacapAllocatorPhaseStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export type DatacapAllocatorStatus = {
  phase: DatacapAllocatorPhase;
  phaseStatus: DatacapAllocatorPhaseStatus;
};

export type ApplicationPullRequest = {
  prNumber: number;
  prUrl: string;
  commentId: number;
  timestamp: Date;
};

export class DatacapAllocator extends AggregateRoot {
  public number: number;
  public name: string;
  public organization: string;
  public address: string;
  public githubUsername: string;
  public country: string;
  public region: string;
  public type: string;
  public datacap: number;

  public status: DatacapAllocatorStatus;
  public datacapAmount: number;
  public applicationPullRequest: ApplicationPullRequest;

  constructor();

  constructor(
    guid: string,
    number: number,
    name: string,
    organization: string,
    address: string,
    githubUsername: string,
    country: string,
    region: string,
    type: string,
    datacap: number
  );

  constructor(
    guid?: string,
    number?: number,
    name?: string,
    organization?: string,
    address?: string,
    githubUsername?: string,
    country?: string,
    region?: string,
    type?: string,
    datacap?: number
  ) {
    super(guid);

    if (
      guid &&
      number &&
      name &&
      organization &&
      address &&
      githubUsername &&
      country &&
      region &&
      type &&
      datacap
    ) {
      this.applyChange(
        new AllocatorApplied(
          guid,
          number,
          name,
          organization,
          address,
          githubUsername,
          country,
          region,
          type,
          datacap
        )
      );
    }
  }

  completeSubmission(pullRequestNumber: number, pullRequestUrl: string, commentId: number) {
    this.ensureValidPhaseStatus(DatacapAllocatorPhase.SUBMISSION, [
      DatacapAllocatorPhaseStatus.IN_PROGRESS,
    ]);

    this.applyChange(
      new ApplicationSubmitted(this.guid, pullRequestNumber, pullRequestUrl, commentId)
    );
    this.applyChange(new KYCStarted(this.guid));
  }

  startKYC() {
    if (
      this.status.phase !== DatacapAllocatorPhase.KYC ||
      this.status.phaseStatus !== DatacapAllocatorPhaseStatus.NOT_STARTED
    ) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        "5308",
        "KYC is already started"
      );
    }

    this.applyChange(new KYCStarted(this.guid));
  }

  approveKYC(data: KYCApprovedData) {
    // TODO
    // this.ensureValidPhaseStatus(DatacapAllocatorPhase.KYC, [
    //   DatacapAllocatorPhaseStatus.NOT_STARTED,
    //   DatacapAllocatorPhaseStatus.IN_PROGRESS,
    // ]);

    this.applyChange(new KYCApproved(this.guid, data));
    this.applyChange(new GovernanceReviewStarted(this.guid));
  }

  rejectKYC(data: KYCRejectedData) {
    this.ensureValidPhaseStatus(DatacapAllocatorPhase.KYC, [
      DatacapAllocatorPhaseStatus.NOT_STARTED,
      DatacapAllocatorPhaseStatus.IN_PROGRESS,
    ]);

    this.applyChange(new KYCRejected(this.guid, data));
    // TODO: Reject application
  }

  // TODO: Deprecate this method
  startGovernanceReview() {
    if (
      this.status.phase !== DatacapAllocatorPhase.GOVERNANCE_REVIEW &&
      this.status.phaseStatus !== DatacapAllocatorPhaseStatus.NOT_STARTED
    ) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        "5311",
        "KYC is not completed"
      );
    }

    this.applyChange(new GovernanceReviewStarted(this.guid));
  }

  approveGovernanceReview() {
    this.ensureValidPhaseStatus(DatacapAllocatorPhase.GOVERNANCE_REVIEW, [
      DatacapAllocatorPhaseStatus.IN_PROGRESS,
    ]);

    this.applyChange(new GovernanceReviewApproved(this.guid));
    this.applyChange(new RKHApprovalStarted(this.guid, 2)); // TODO: Hardcoded 2 for multisig threshold
  }

  rejectGovernanceReview() {
    this.ensureValidPhaseStatus(DatacapAllocatorPhase.GOVERNANCE_REVIEW, [
      DatacapAllocatorPhaseStatus.IN_PROGRESS,
    ]);

    this.applyChange(new GovernanceReviewRejected(this.guid));
    // TODO: Reject application
  }

  submitRKHSignature() {}

  applyAllocatorApplied(event: AllocatorApplied) {
    this.guid = event.guid;
    this.number = event.number;
    this.name = event.name;
    this.organization = event.organization;
    this.address = event.address;
    this.githubUsername = event.githubUsername;
    this.country = event.country;
    this.region = event.region;
    this.type = event.type;
    this.datacap = event.datacap;

    this.status = {
      phase: DatacapAllocatorPhase.SUBMISSION,
      phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
    };
  }

  applyApplicationSubmitted(event: ApplicationSubmitted) {
    this.applicationPullRequest = {
      prNumber: event.prNumber,
      prUrl: event.prUrl,
      commentId: event.commentId,
      timestamp: event.timestamp,
    };

    this.status = {
      phase: DatacapAllocatorPhase.KYC,
      phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED
    }
  }

  applyKYCStarted(event: KYCStarted) {
    this.status = {
      phase: DatacapAllocatorPhase.KYC,
      phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
    };
  }

  applyKYCApproved(event: KYCApproved) {
    this.status = {
      phase: DatacapAllocatorPhase.KYC,
      phaseStatus: DatacapAllocatorPhaseStatus.COMPLETED,
    };
  }

  applyKYCRejected(event: KYCRejected) {
    this.status = {
      phase: DatacapAllocatorPhase.KYC,
      phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
    };
  }

  applyGovernanceReviewStarted(event: GovernanceReviewStarted) {
    this.status = {
      phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
      phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
    };
  }

  applyGovernanceReviewApproved(event: GovernanceReviewApproved) {
    this.status = {
      phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
      phaseStatus: DatacapAllocatorPhaseStatus.COMPLETED,
    };
  }

  applyGovernanceReviewRejected(event: GovernanceReviewRejected) {
    this.status = {
      phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
      phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
    };
  }

  applyRKHApprovalStarted(event: RKHApprovalStarted) {
    this.status = {
      phase: DatacapAllocatorPhase.RKH_APPROVAL,
      phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
    };
  }

  applyRKHSignatureSubmitted(event: RKHSignatureSubmitted) {
    throw new Error("Method not implemented.");
  }

  applyRKHApprovalApproved(event: RKHApprovalApproved) {
    this.status = {
      phase: DatacapAllocatorPhase.RKH_APPROVAL,
      phaseStatus: DatacapAllocatorPhaseStatus.COMPLETED,
    };
  }

  applyRKHApprovalRejected(event: RKHApprovalRejected) {
    this.status = {
      phase: DatacapAllocatorPhase.RKH_APPROVAL,
      phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
    };
  }

  private ensureValidPhaseStatus(
    expectedPhase: DatacapAllocatorPhase,
    validStatuses: DatacapAllocatorPhaseStatus[],
    errorCode: string = "5308",
    errorMessage: string = "Invalid operation for the current phase"
  ): void {
    if (
      this.status.phase !== expectedPhase ||
      !validStatuses.includes(this.status.phaseStatus)
    ) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        errorCode,
        errorMessage
      );
    }
  }
}
