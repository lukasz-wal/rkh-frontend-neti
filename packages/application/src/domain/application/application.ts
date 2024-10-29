import { AggregateRoot, ApplicationError, IEventStore, IRepository } from '@filecoin-plus/core'
import { StatusCodes } from 'http-status-codes'

import {
  GovernanceReviewStarted,
  KYCStarted,
  KYCApproved,
  KYCRejected,
  GovernanceReviewApproved,
  GovernanceReviewRejected,
  RKHApprovalStarted,
  DatacapAllocationUpdated,
  RKHApprovalsUpdated,
  RKHApprovalCompleted,
  // xTODO: add meta allocator approval events
  MetaAllocatorApprovalStarted,
  MetaAllocatorApprovalCompleted,
  ApplicationCreated,
  ApplicationEdited,
  ApplicationPullRequestUpdated,
  AllocatorMultisigUpdated,
} from './application.events'
import { KYCApprovedData, KYCRejectedData } from '@src/domain/types'

export interface IDatacapAllocatorRepository extends IRepository<DatacapAllocator> { }

export interface IDatacapAllocatorEventStore extends IEventStore<DatacapAllocator> { }

export enum ApplicationStatus {
  SUBMISSION_PHASE = 'SUBMISSION_PHASE',
  KYC_PHASE = 'KYC_PHASE',
  GOVERNANCE_REVIEW_PHASE = 'GOVERNANCE_REVIEW_PHASE',
  RKH_APPROVAL_PHASE = 'RKH_APPROVAL_PHASE',
  // DONE xTODO: add phase for meta allocator
  META_APPROVAL_PHASE = 'META_APPROVAL_PHASE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ApplicationAllocator {
  META_ALLOCATOR = 'META_ALLOCATOR',
  RKH_ALLOCATOR = 'RKH_ALLOCATOR',
}

export type ApplicationPullRequest = {
  prNumber: number
  prUrl: string
  commentId: number
  timestamp: Date
}

export type ApplicationApplicantData = {
  name: string
  location: string
  githubHandle: string
  slackHandle: string
  address: string
  orgName: string
  orgAddress: string
}

export class DatacapAllocator extends AggregateRoot {
  public applicationNumber: number
  public applicationPullRequest: ApplicationPullRequest

  public applicantName: string
  public applicantLocation: string
  public applicantGithubHandle: string
  public applicantSlackHandle: string
  public applicantAddress: string
  public applicantOrgName: string
  public applicantOrgAddresses: string[]

  public allocationStandardizedAllocations: string[]
  public allocationTargetClients: string[]
  public allocationRequiredReplicas: string
  public allocationRequiredStorageProviders: string
  public allocationTooling: string[]
  public allocationDataTypes: string[]
  public allocationProjected12MonthsUsage: string
  public allocationBookkeepingRepo: string
  // DONE xTODO: amount + method here
  public allocationInstructionMethod: string[]
  public allocationInstructionAmount: number[]
  public allocationInstructionTimestamp: number[]

  public applicationStatus: ApplicationStatus

  public type: string
  public datacap: number
  public datacapAmount: number

  public rkhApprovalThreshold: number = 2
  public rkhApprovals: string[] = []

  public allocatorActorId?: string
  public allocatorMultisigAddress?: string
  public allocatorMultisigThreshold?: number
  public allocatorMultisigSigners?: string[]

  constructor(guid?: string) {
    super(guid)
  }

  static create(params: {
    applicationId: string
    applicationNumber: number
    applicantName: string
    applicantLocation: string
    applicantGithubHandle: string
    applicantSlackHandle: string
    applicantAddress: string
    applicantOrgName: string
    applicantOrgAddresses: string[]
    allocationStandardizedAllocations: string[]
    allocationTargetClients: string[]
    allocationRequiredReplicas: string
    allocationRequiredStorageProviders: string
    allocationTooling: string[]
    allocationDataTypes: string[]
    allocationProjected12MonthsUsage: string
    allocationBookkeepingRepo: string
    // DONE xTODO: amount + method here
    allocationInstructionMethod: string[]
    allocationInstructionAmount: number[]
    allocationInstructionTimestamp: number[]
    type: string
    datacap: number
  }): DatacapAllocator {
    const allocator = new DatacapAllocator(params.applicationId)
    allocator.applyChange(
      new ApplicationCreated(
        allocator.guid,
        params.applicationNumber,
        params.applicantName,
        params.applicantLocation,
        params.applicantGithubHandle,
        params.applicantSlackHandle,
        params.applicantAddress,
        params.applicantOrgName,
        params.applicantOrgAddresses,
        params.allocationStandardizedAllocations,
        params.allocationTargetClients,
        params.allocationRequiredReplicas,
        params.allocationRequiredStorageProviders,
        params.allocationTooling,
        params.allocationDataTypes,
        params.allocationProjected12MonthsUsage,
        params.allocationBookkeepingRepo,
        // DONE xTODO: amount + method here 
        params.allocationInstructionMethod,
        params.allocationInstructionAmount,
        params.allocationInstructionTimestamp,
        params.type,
        params.datacap,
      ),
    )
    return allocator
  }

  edit(params: {
    applicationNumber?: number
    applicantName?: string
    applicantLocation?: string
    applicantGithubHandle?: string
    applicantSlackHandle?: string
    applicantAddress?: string
    applicantOrgName?: string
    applicantOrgAddresses?: string[]
    allocationStandardizedAllocations?: string[]
    allocationTargetClients?: string[]
    allocationRequiredReplicas?: string
    allocationRequiredStorageProviders?: string
    allocationTooling?: string[]
    allocationDataTypes?: string[]
    allocationProjected12MonthsUsage?: string
    allocationBookkeepingRepo?: string
    // DONE xTODO: allocation instruction .edit
    applicationInstructionMethod?: string[]
    applicationInstructionAmount?: number[]
    applicationInstructionTimestamp?: number[]
  }) {
    this.ensureValidApplicationStatus([
      ApplicationStatus.SUBMISSION_PHASE,
      ApplicationStatus.KYC_PHASE,
      ApplicationStatus.GOVERNANCE_REVIEW_PHASE,
    ])

    this.applyChange(
      new ApplicationEdited(
        this.guid,
        params.applicationNumber,
        params.applicantName,
        params.applicantLocation,
        params.applicantGithubHandle,
        params.applicantSlackHandle,
        params.applicantAddress,
        params.applicantOrgName,
        params.applicantOrgAddresses,
        params.allocationStandardizedAllocations,
        params.allocationTargetClients,
        params.allocationRequiredReplicas,
        params.allocationRequiredStorageProviders,
        params.allocationTooling,
        params.allocationDataTypes,
        params.allocationProjected12MonthsUsage,
        params.allocationBookkeepingRepo,
        // DONE xTODO: allocation instruction
        params.applicationInstructionMethod,
        params.applicationInstructionAmount,
        params.applicationInstructionTimestamp,
      ),
    )
  }

  setAllocatorMultisig(
    allocatorActorId: string,
    multisigAddress: string,
    multisigThreshold: number,
    multisigSigners: string[],
  ) {
    this.ensureValidApplicationStatus([ApplicationStatus.SUBMISSION_PHASE])

    this.applyChange(
      new AllocatorMultisigUpdated(this.guid, allocatorActorId, multisigAddress, multisigThreshold, multisigSigners),
    )
  }

  setApplicationPullRequest(pullRequestNumber: number, pullRequestUrl: string, commentId: number) {
    this.ensureValidApplicationStatus([ApplicationStatus.SUBMISSION_PHASE])

    this.applyChange(new ApplicationPullRequestUpdated(this.guid, pullRequestNumber, pullRequestUrl, commentId))
  }

  approveKYC(data: KYCApprovedData) {
    this.ensureValidApplicationStatus([ApplicationStatus.KYC_PHASE])

    this.applyChange(new KYCApproved(this.guid, data))
    this.applyChange(new GovernanceReviewStarted(this.guid))
  }

  rejectKYC(data: KYCRejectedData) {
    this.ensureValidApplicationStatus([ApplicationStatus.KYC_PHASE])

    this.applyChange(new KYCRejected(this.guid, data))
  }

  approveGovernanceReview() {
    this.ensureValidApplicationStatus([ApplicationStatus.GOVERNANCE_REVIEW_PHASE])
    this.ensureValidApplicationInstructionMethod([
      ApplicationAllocator.META_ALLOCATOR,
      ApplicationAllocator.RKH_ALLOCATOR,
    ])

    const allocationMethod = this.applicationInstructionMethod[this.applicationInstructionMethod.length - 1];
    this.applyChange(new GovernanceReviewApproved(this.guid, allocationMethod))

    if (allocationMethod === ApplicationAllocator.META_ALLOCATOR) {
      console.log("MetaAllocatorApprovalStarted...")
      this.applyChange(new MetaAllocatorApprovalStarted(this.guid))
      // this.applyChange(new MetaAllocatorApprovalCompleted(this.guid, 0, '0x'))
    } else {
      this.applyChange(new RKHApprovalStarted(this.guid, 2)) // TODO: Hardcoded 2 for multisig threshold
    }

  }

  rejectGovernanceReview() {
    this.ensureValidApplicationStatus([ApplicationStatus.GOVERNANCE_REVIEW_PHASE])

    this.applyChange(new GovernanceReviewRejected(this.guid))
  }

  updateRKHApprovals(messageId: number, approvals: string[]) {
    this.ensureValidApplicationStatus([ApplicationStatus.RKH_APPROVAL_PHASE])

    if (approvals.length !== this.rkhApprovals.length) {
      this.applyChange(new RKHApprovalsUpdated(this.guid, messageId, approvals, this.rkhApprovalThreshold))
    }
  }

  // xTODO: Error handling
  completeMetaAllocatorApproval(blockNumber: number, txHash: string) {
    console.log("completing meta approval... GUID: ", this.guid)
    // DONE xTODO: add blockNumber and txHash to the event
    this.applyChange(new MetaAllocatorApprovalCompleted(this.guid, blockNumber, txHash))
  }

  completeRKHApproval() {
    this.ensureValidApplicationStatus([ApplicationStatus.RKH_APPROVAL_PHASE])
    this.applyChange(new RKHApprovalCompleted(this.guid))
  }

  updateDatacapAllocation(datacap: number) {
    try {
      this.completeRKHApproval()
    } catch (error) { }
    // TODO: this.applyChange(new DatacapAllocationUpdated(this.guid, datacap));
  }

  applyApplicationCreated(event: ApplicationCreated) {
    this.guid = event.guid

    this.applicationNumber = event.applicationNumber
    this.applicantName = event.applicantName
    this.applicantLocation = event.applicantLocation
    this.applicantGithubHandle = event.applicantGithubHandle
    this.applicantSlackHandle = event.applicantSlackHandle
    this.applicantAddress = event.applicantAddress
    this.applicantOrgName = event.applicantOrgName
    this.applicantOrgAddresses = event.applicantOrgAddresses

    this.allocationStandardizedAllocations = event.allocationStandardizedAllocations
    this.allocationTargetClients = event.allocationTargetClients
    this.allocationRequiredReplicas = event.allocationRequiredReplicas
    this.allocationRequiredStorageProviders = event.allocationRequiredStorageProviders
    this.allocationTooling = event.allocationTooling
    this.allocationDataTypes = event.allocationDataTypes
    this.allocationProjected12MonthsUsage = event.allocationProjected12MonthsUsage
    this.allocationBookkeepingRepo = event.allocationBookkeepingRepo

    this.type = event.type
    this.datacap = event.datacap

    this.applicationStatus = ApplicationStatus.SUBMISSION_PHASE
  }

  applyApplicationEdited(event: ApplicationEdited) {
    this.name = event.applicantName || this.name
    this.organization = event.applicantOrgName || this.organization
    this.address = event.applicantAddress || this.address
    this.githubUsername = event.applicantGithubHandle || this.githubUsername
    this.slackUsername = event.applicantSlackHandle || this.slackUsername
    this.country = event.applicantLocation || this.country
    this.region = event.applicantLocation || this.region
    this.allocationStandardizedAllocations = event.standardizedAllocations || this.allocationStandardizedAllocations
  }

  applyAllocatorMultisigUpdated(event: AllocatorMultisigUpdated) {
    this.allocatorActorId = event.allocatorActorId
    this.allocatorMultisigAddress = event.multisigAddress
    this.allocatorMultisigThreshold = event.multisigThreshold
    this.allocatorMultisigSigners = event.multisigSigners

    if (this.applicationStatus === ApplicationStatus.SUBMISSION_PHASE && this.applicationPullRequest) {
      this.applicationStatus = ApplicationStatus.KYC_PHASE
    }
  }

  applyApplicationPullRequestUpdated(event: ApplicationPullRequestUpdated) {
    this.applicationPullRequest = {
      prNumber: event.prNumber,
      prUrl: event.prUrl,
      commentId: event.commentId,
      timestamp: event.timestamp,
    }

    if (this.applicationStatus === ApplicationStatus.SUBMISSION_PHASE && this.allocatorActorId) {
      this.applicationStatus = ApplicationStatus.KYC_PHASE
    }
  }

  applyKYCStarted(_: KYCStarted) {
    this.applicationStatus = ApplicationStatus.KYC_PHASE
  }

  applyKYCApproved(_: KYCApproved) {
    // TODO: ?
  }

  applyKYCRejected(_: KYCRejected) {
    this.applicationStatus = ApplicationStatus.REJECTED
  }

  applyGovernanceReviewStarted(_: GovernanceReviewStarted) {
    this.applicationStatus = ApplicationStatus.GOVERNANCE_REVIEW_PHASE
  }

  applyGovernanceReviewApproved(_: GovernanceReviewApproved) {
    // TODO: ?
  }

  applyGovernanceReviewRejected(_: GovernanceReviewRejected) {
    this.applicationStatus = ApplicationStatus.REJECTED
  }

  applyRKHApprovalStarted(event: RKHApprovalStarted) {
    this.applicationStatus = ApplicationStatus.RKH_APPROVAL_PHASE
    this.rkhApprovalThreshold = event.approvalThreshold
  }

  applyRKHApprovalsUpdated(event: RKHApprovalsUpdated) {
    this.applicationStatus =
      event.approvals.length < event.approvalThreshold
        ? ApplicationStatus.RKH_APPROVAL_PHASE
        : ApplicationStatus.APPROVED

    this.rkhApprovals = event.approvals
    this.rkhApprovalThreshold = event.approvalThreshold
  }

  applyRKHApprovalCompleted(event: RKHApprovalCompleted) {
    this.applicationStatus = ApplicationStatus.APPROVED
  }

  // DONE xTODO: Create apply method for meta allocator
  applyMetaAllocatorApprovalStarted(event: MetaAllocatorApprovalStarted) {
    this.applicationStatus = ApplicationStatus.META_APPROVAL_PHASE
    console.log("Inside applyMetaAllocatorApprovalStarted - status: ", this.applicationStatus)
  }

  // DONE xTODO: Create apply method for meta allocator
  applyMetaAllocatorApprovalCompleted(event: MetaAllocatorApprovalCompleted) {
    this.applicationStatus = ApplicationStatus.APPROVED
  }

  applyDatacapAllocationUpdated(event: DatacapAllocationUpdated) {
    this.applicationStatus = ApplicationStatus.APPROVED
    this.datacapAmount = event.datacap
  }

  private ensureValidApplicationStatus(
    expectedStatuses: ApplicationStatus[],
    errorCode: string = '5308',
    errorMessage: string = 'Invalid operation for the current phase',
  ): void {
    if (!expectedStatuses.includes(this.applicationStatus)) {
      throw new ApplicationError(StatusCodes.BAD_REQUEST, errorCode, errorMessage)
    }
  }

  private ensureValidApplicationInstructionMethod(
    expectedInstructionMethods: ApplicationAllocator[],
    errorCode: string = '5308',
    errorMessage: string = 'Invalid operation for the current phase',
  ): void {

    // Ensure length of applicationInstructionMethod is greater than 0 and consistent with other instruction details
    if (
      this.applicationInstructionMethod.length === 0 ||
      this.applicationInstructionMethod.length !== this.applicationInstructionAmount.length ||
      this.applicationInstructionMethod.length !== this.applicationInstructionTimestamp.length
    ) {
      throw new ApplicationError(StatusCodes.BAD_REQUEST, errorCode, 'Mismatch or empty instruction data')
    }

    // Ensure that allocationMethod is in expectedInstructionMethods else throw an error
    const allocationMethod = this.applicationInstructionMethod[this.applicationInstructionMethod.length - 1]
    if (!expectedInstructionMethods.includes(allocationMethod)) {
      throw new ApplicationError(StatusCodes.BAD_REQUEST, errorCode, errorMessage)
    }

  }
}
