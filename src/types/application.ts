export type ApplicationPhase = "SUBMISSION" | "KYC" | "GOVERNANCE_REVIEW" | "RKH_APPROVAL" | "DATA_CAP_GRANT";
export type ApplicationPhaseStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type ApplicationStatus = {
  phase: ApplicationPhase;
  phaseStatus: ApplicationPhaseStatus;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  githubId: string;
  createdAt: string;

  // STATUS
  status: ApplicationStatus;

  // SUBMISSION PHASE
  githubPrNumber: string;
  githubPrLink: string;

  // KYC PHASE
  // ---

  // GOVERNANCE REVIEW PHASE
  // ---

  // KHK APPROVAL PHASE
  // ---
}

export interface ApplicationsResponse {
  applications: Application[];
  totalCount: number;
}
