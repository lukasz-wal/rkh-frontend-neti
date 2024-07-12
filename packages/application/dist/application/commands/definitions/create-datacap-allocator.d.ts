import { Command } from "@filecoin-plus/core";
/**
 * Represents the regions where an allocator can operate.
 */
export declare enum RegionOfOperation {
    Africa = "Africa",
    AsiaMinusGCR = "Asia minus GCR",
    Europe = "Europe",
    GreaterChinaRegion = "Greater China Region",
    NorthAmerica = "North America",
    Oceania = "Oceania",
    SouthAmerica = "South America"
}
/**
 * Represents the methods of monetization for an allocator.
 */
export type MonetizationMethod = "Client fees" | "SP fees" | "Block rewards, pools" | "Client staking" | "None" | "Other";
/**
 * Represents the types of target clients for an allocator.
 */
export type TargetClientType = "Web3 developers" | "Nonprofit organizations" | "Commercial/Enterprise" | "Individuals" | "Open/Public" | "Other";
/**
 * Represents the types of compliance reports an allocator can submit.
 */
export type ComplianceReportType = "Success metric: Proof of Payments from clients" | "Success metric: onchain report of data onboarded" | "Success metric: onchain data report" | "Client Diligence: Client statements, client provided verification" | "Client Diligence: Legal Review documents" | "Client Diligence: Financial Audits and Credit Check reports" | "Client Diligence: KYC/KYB report on clients" | "Data Compliance: Proof of provenance report" | "Data Compliance: Data Samples" | "Data Compliance: Manual report" | "Compliance: CID report" | "Client/Data Compliance: external third-party audit" | "Contributions: Educational Materials Developed" | "Contributions: Github repos with the tools developed" | "More";
/**
 * Command to register a new Fil+ Allocator application.
 */
export declare class CreateDatacapAllocatorCommand extends Command {
    /** The GitHub user ID of the applicant. */
    readonly githubUserId: string;
    /** The GitHub PR number associated with the application. */
    readonly githubPrNumber: number;
    /** The unique name of the allocator onboarding pathway. */
    readonly allocatorPathwayName: string;
    /** The name of the organization applying. */
    readonly organizationName: string;
    /** The on-chain address associated with the organization. */
    readonly organizationOnChainAddress: string;
    /** The region where the allocator will operate. */
    readonly regionOfOperation: RegionOfOperation;
    /** The type of allocator. */
    readonly typeOfAllocator: string;
    /** Acknowledgement of the Filecoin Community Agreement. */
    readonly filecoinCommunityAgreement: "Acknowledge" | "Deny";
    /** The on-chain address for receiving DataCap. */
    readonly onChainAddress: string;
    /** Description of contributions to the ecosystem. */
    readonly contributionsToEcosystem: string;
    /** Methods of monetization and fee structure. */
    readonly monetizationAndFeeStructure: MonetizationMethod[];
    /** Types of target clients. */
    readonly targetClients: TargetClientType[];
    /** Description of client diligence process. */
    readonly clientDiligenceDescription: string;
    /** Description of data diligence process. */
    readonly dataDiligenceDescription: string;
    /** Description of allocator tooling. */
    readonly allocatorTooling: string;
    /** Link to the GitHub bookkeeping repository. */
    readonly githubBookkeepingRepoLink: string;
    /** Description of success metrics. */
    readonly successMetrics: string;
    /** Timeline to begin allocating to clients. */
    readonly timelineToBeginAllocating: string;
    /** Expected DataCap usage over 12 months. */
    readonly expectedDataCapUsage: string;
    /** Description of risk mitigation strategies. */
    readonly riskMitigationStrategies: string;
    /** Description of dispute resolution processes. */
    readonly disputeResolutions: string;
    /** Description of compliance audit check process. */
    readonly complianceAuditCheck: string;
    /** Types of compliance reports to be submitted. */
    readonly complianceReports: ComplianceReportType[];
    /**
     * Creates a new RegisterApplicationCommand instance.
     * @param data - Partial data to initialize the command.
     */
    constructor(data: Partial<CreateDatacapAllocatorCommand>);
}
