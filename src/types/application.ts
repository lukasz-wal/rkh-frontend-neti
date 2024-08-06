export type ApplicationPhase = "SUBMISSION" | "KYC" | "GOVERNANCE_REVIEW" | "RKH_APPROVAL" | "DATA_CAP_GRANT";
export type ApplicationPhaseStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type ApplicationStatus = {
  phase: ApplicationPhase;
  phaseStatus: ApplicationPhaseStatus;
}

export interface Application {
  id: string;
  number: number;
  name: string;
  organization: string;
  address: string;
  github: string;
  country: string;
  region: string;
  type: string;
  datacap: string;

  // STATUS
  status: ApplicationStatus;

  phases: any; // TODO: Type this

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
