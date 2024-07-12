import { Command } from "@filecoin-plus/core";
/**
 * Represents the regions where an allocator can operate.
 */
export var RegionOfOperation;
(function (RegionOfOperation) {
    RegionOfOperation["Africa"] = "Africa";
    RegionOfOperation["AsiaMinusGCR"] = "Asia minus GCR";
    RegionOfOperation["Europe"] = "Europe";
    RegionOfOperation["GreaterChinaRegion"] = "Greater China Region";
    RegionOfOperation["NorthAmerica"] = "North America";
    RegionOfOperation["Oceania"] = "Oceania";
    RegionOfOperation["SouthAmerica"] = "South America";
})(RegionOfOperation || (RegionOfOperation = {}));
/**
 * Command to register a new Fil+ Allocator application.
 */
export class CreateDatacapAllocatorCommand extends Command {
    /** The GitHub user ID of the applicant. */
    githubUserId;
    /** The GitHub PR number associated with the application. */
    githubPrNumber;
    /** The unique name of the allocator onboarding pathway. */
    allocatorPathwayName;
    /** The name of the organization applying. */
    organizationName;
    /** The on-chain address associated with the organization. */
    organizationOnChainAddress;
    /** The region where the allocator will operate. */
    regionOfOperation;
    /** The type of allocator. */
    typeOfAllocator;
    /** Acknowledgement of the Filecoin Community Agreement. */
    filecoinCommunityAgreement;
    /** The on-chain address for receiving DataCap. */
    onChainAddress;
    /** Description of contributions to the ecosystem. */
    contributionsToEcosystem;
    /** Methods of monetization and fee structure. */
    monetizationAndFeeStructure;
    /** Types of target clients. */
    targetClients;
    /** Description of client diligence process. */
    clientDiligenceDescription;
    /** Description of data diligence process. */
    dataDiligenceDescription;
    /** Description of allocator tooling. */
    allocatorTooling;
    /** Link to the GitHub bookkeeping repository. */
    githubBookkeepingRepoLink;
    /** Description of success metrics. */
    successMetrics;
    /** Timeline to begin allocating to clients. */
    timelineToBeginAllocating;
    /** Expected DataCap usage over 12 months. */
    expectedDataCapUsage;
    /** Description of risk mitigation strategies. */
    riskMitigationStrategies;
    /** Description of dispute resolution processes. */
    disputeResolutions;
    /** Description of compliance audit check process. */
    complianceAuditCheck;
    /** Types of compliance reports to be submitted. */
    complianceReports;
    /**
     * Creates a new RegisterApplicationCommand instance.
     * @param data - Partial data to initialize the command.
     */
    constructor(data) {
        super();
        Object.assign(this, data);
    }
}
