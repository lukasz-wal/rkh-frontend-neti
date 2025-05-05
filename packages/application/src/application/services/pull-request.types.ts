import { ApplicationInstruction, DatacapAllocator } from '@src/domain/application/application'
import { ApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import config from '@src/config'

export type ApplicationPullRequestFile = {
  application_number: number
  address: string
  name: string
  organization: string
  metapathway_type: string
  ma_address: string
  associated_org_addresses: string
  application: {
    allocations: string[]
    audit: string[]
    distribution: string[]
    required_sps: string
    required_replicas: string
    tooling: string[]
    max_DC_client: string
    github_handles: string[]
    allocation_bookkeeping: string
    client_contract_address: string
  }
  status: {
    [key: string]: string
  }
  LifeCycle: {
    [key: string]: [string, string]
  }
  pathway_addresses?: {
    msig: string
    signer: string[]
  }
}

export function mapApplicationToPullRequestFile(application: DatacapAllocator): ApplicationPullRequestFile {
  const lifeCycle = (application.applicationInstructions || []).reduce(
    (acc, instruction, index) => {
      const timestamp = instruction.timestamp ? instruction.timestamp.toString() : ''
      acc[`Audit ${index + 1}`] = [timestamp, instruction.datacap_amount.toString()]
      return acc
    },
    {} as { [key: string]: [string, string] },
  )

  // Filter and map the status object
  const mappedStatus: { [key: string]: string } = {}
  if (application.status) {
    for (const [key, value] of Object.entries(application.status)) {
      if (value !== null && value !== undefined) {
        mappedStatus[key] = String(value) // Convert value to string
      }
    }
  }

  return {
    application_number: application?.applicationPullRequest?.prNumber,
    address: application.applicantAddress,
    name: application.applicantName,
    organization: application.applicantOrgName,
    metapathway_type: 'MA',
    ma_address: config.MA_ADDRESSES,
    associated_org_addresses: application.applicantOrgAddresses,
    application: {
      allocations: application.allocationStandardizedAllocations,
      audit: application.allocationAudit ? [application.allocationAudit] : [],
      distribution: application.allocationDistributionRequired ? [application.allocationDistributionRequired] : [],
      required_sps: application.allocationRequiredStorageProviders,
      required_replicas: application.allocationRequiredReplicas,
      tooling: application.allocationTooling,
      max_DC_client: application.maxDcClient,
      github_handles: [application.applicantGithubHandle, ...application.otherGithubHandles ?? []],
      allocation_bookkeeping: application.allocationBookkeepingRepo,
      client_contract_address: "",
    },
    status: mappedStatus,
    LifeCycle: lifeCycle,
    pathway_addresses: {
      msig: application.allocatorMultisigAddress || "",
      signer: application.allocatorMultisigSigners || [],
    },
  }
}
