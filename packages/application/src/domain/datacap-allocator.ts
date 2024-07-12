import {
  AggregateRoot,
  ApplicationError,
  IEventStore,
  IRepository,
} from "@filecoin-plus/core";
import { StatusCodes } from "http-status-codes";

import {
  AllocatorApplied,
  ApplicationPullRequestCreated,
  DatacapGranted,
  GovernanceReviewStarted,
  KYCStarted,
  KYCApproved,
  KYCRejected,
  GovernanceReviewApproved,
  GovernanceReviewRejected,
} from "./events";

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
  timestamp: Date;
};

export class DatacapAllocator extends AggregateRoot {
  public firstname: string;
  public lastname: string;
  public email: string;
  public githubId: string;
  public currentPosition: string;
  public status: DatacapAllocatorStatus;
  public datacapAmount: number;
  public applicationPullRequest: ApplicationPullRequest;

  constructor();

  constructor(
    guid: string,
    firstname: string,
    lastname: string,
    email: string,
    githubId: string,
    currentPosition: string
  );

  constructor(
    guid?: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    githubId?: string,
    currentPosition?: string
  ) {
    super(guid);

    if (guid && firstname && lastname && email && githubId && currentPosition) {
      this.applyChange(
        new AllocatorApplied(
          guid,
          firstname,
          lastname,
          email,
          githubId,
          currentPosition
        )
      );
    }
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

    this.applyChange(new KYCStarted(this.guid, new Date()));
  }

  approveKYC() {
    if (this.status.phase !== DatacapAllocatorPhase.KYC) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        "5309",
        "Not in KYC phase"
      );
    }

    if (
      this.status.phaseStatus === DatacapAllocatorPhaseStatus.COMPLETED ||
      this.status.phaseStatus === DatacapAllocatorPhaseStatus.FAILED
    ) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        "5310",
        "KYC is already finished"
      );
    }

    this.applyChange(new KYCApproved(this.guid, new Date()));
  }

  rejectKYC() {
    if (this.status.phase !== DatacapAllocatorPhase.KYC) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        "5309",
        "Not in KYC phase"
      );
    }

    if (
      this.status.phaseStatus === DatacapAllocatorPhaseStatus.COMPLETED ||
      this.status.phaseStatus === DatacapAllocatorPhaseStatus.FAILED
    ) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        "5310",
        "KYC is already finished"
      );
    }

    this.applyChange(new KYCRejected(this.guid, new Date()));
  }

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

    this.applyChange(new GovernanceReviewStarted(this.guid, new Date()));
  }

  approveGovernanceReview() {
    if (
      this.status.phase !== DatacapAllocatorPhase.GOVERNANCE_REVIEW ||
      this.status.phaseStatus !== DatacapAllocatorPhaseStatus.IN_PROGRESS
    ) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        "5312",
        "Governance review is not started"
      );
    }

    this.applyChange(new GovernanceReviewApproved(this.guid, new Date()));
  }

  rejectGovernanceReview() {
    if (
      this.status.phase !== DatacapAllocatorPhase.GOVERNANCE_REVIEW ||
      this.status.phaseStatus !== DatacapAllocatorPhaseStatus.IN_PROGRESS
    ) {
      throw new ApplicationError(
        StatusCodes.BAD_REQUEST,
        "5312",
        "Governance review is not started"
      );
    }

    this.applyChange(new GovernanceReviewRejected(this.guid, new Date()));
  }

  grantDatacap(datacapAmount: number, grantedBy: string, timestamp: Date) {
    this.applyChange(
      new DatacapGranted(
        this.guid,
        this.allocatorId,
        datacapAmount,
        grantedBy,
        timestamp
      )
    );
  }

  createApplicationPullRequest(
    pullRequestNumber: number,
    pullRequestUrl: string
  ) {
    this.applyChange(
      new ApplicationPullRequestCreated(
        this.guid,
        pullRequestNumber,
        pullRequestUrl,
        new Date()
      )
    );
  }

  applyAllocatorApplied(event: AllocatorApplied) {
    this.guid = event.guid;
    this.firstname = event.firstname;
    this.lastname = event.lastname;
    this.email = event.email;
    this.githubId = event.githubId;
    this.currentPosition = event.currentPosition;

    this.status = {
      phase: DatacapAllocatorPhase.KYC,
      phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
    };
  }

  applyKYCStarted(event: KYCStarted) {
    this.status = {
      phase: DatacapAllocatorPhase.KYC,
      phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
    };
  }

  applyKYCApproved(event: KYCApproved) {
    this.status = {
      phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
      phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
    };
  }

  applyKYCRejected(event: KYCRejected) {
    this.status = {
      phase: DatacapAllocatorPhase.KYC,
      phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
    };
  }

  public applyGovernanceReviewStarted(event: GovernanceReviewStarted) {
    this.status = {
      phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
      phaseStatus: DatacapAllocatorPhaseStatus.IN_PROGRESS,
    };
  }

  applyGovernanceReviewApproved(event: GovernanceReviewApproved) {
    this.status = {
      phase: DatacapAllocatorPhase.RKH_APPROVAL,
      phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
    };
  }

  applyGovernanceReviewRejected(event: GovernanceReviewRejected) {
    this.status = {
      phase: DatacapAllocatorPhase.GOVERNANCE_REVIEW,
      phaseStatus: DatacapAllocatorPhaseStatus.FAILED,
    };
  }

  applyDatacapGranted(event: DatacapGranted) {
    this.datacapAmount = event.datacapAmount;
  }

  applyApplicationPullRequestCreated(event: ApplicationPullRequestCreated) {
    this.applicationPullRequest = {
      prNumber: event.prNumber,
      prUrl: event.prUrl,
      timestamp: event.timestamp,
    };
  }
}
