export type ApplicationStatus = "SUBMISSION_PHASE" | "KYC_PHASE" | "GOVERNANCE_REVIEW_PHASE" | "RKH_APPROVAL_PHASE" | "APPROVED" | "REJECTED";

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

  actorId?: string;

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
  rkhApprovals?: string[];
  rkhApprovalsThreshold?: number;
}

export interface ApplicationsResponse {
  applications: Application[];
  totalCount: number;
}
