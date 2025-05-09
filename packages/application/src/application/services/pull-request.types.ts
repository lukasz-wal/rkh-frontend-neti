import { ApplicationInstruction, DatacapAllocator } from '@src/domain/application/application'
import { ApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import config from '@src/config'
import { getMultisigInfo } from '@src/infrastructure/clients/filfox'

export type ApplicationPullRequestFile = {
  application_number: number
  address: string
  name: string
  allocator_id: string
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



export async function mapApplicationToPullRequestFile(application: DatacapAllocator): Promise<ApplicationPullRequestFile>{
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

 //get current values of msig
  let allocatorId     = application.allocatorMultisigAddress ?? ""
  let updatedSigners  = application.allocatorMultisigSigners ?? []

  //if we have an on-chain address, fetch the latest from Filfox
  if (application.allocatorMultisigAddress) {
    try {
      const msigData = await getMultisigInfo(
        application.allocatorMultisigAddress
      )

      if (msigData.id !== application.allocatorMultisigAddress) {
        allocatorId = msigData.id
      }

      const fetchedSigners = msigData.multisig.signers
      if (
        JSON.stringify(fetchedSigners) !==
        JSON.stringify(application.allocatorMultisigSigners)
      ) {
        updatedSigners = fetchedSigners
      }
    } catch (err) {
      console.error(
        `mapApplicationToPullRequestFile: failed to fetch Filfox info for ${
          application.allocatorMultisigAddress
        }:`,
        err
      )
      // keep the old values if the fetch fails
    }
  }

  return {
    application_number: application?.applicationPullRequest?.prNumber,
    address: application.applicantAddress,
    name: application.applicantName,
    allocator_id: allocatorId,
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
      msig: allocatorId,
      signer: updatedSigners,
    },
  }
}
