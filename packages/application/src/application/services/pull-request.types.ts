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
  allocation_bookkeeping: string,
  metapathway_type: string
  ma_address: string
  associated_org_addresses: string
  pathway_addresses?: {
    msig: string
    signer: string[]
  }
  application: {
    allocations: string[]
    audit: string[]
    tranche_schedule: string
    distribution: string[]
    required_sps: string
    required_replicas: string
    tooling: string[]
    max_DC_client: string
    github_handles: string[]
    allocation_bookkeeping: string
    client_contract_address: string
  }
  history: {
    [key: string]: string []
  }
  audit_outcomes: {
    [key: string]: [string, string]
  }
  old_allocator_id: string
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

  // Filter and map the distribution object
  const mappedStatus: { [key: string]: string[] } = {}
  if (application.status) {
    for (const [key, value] of Object.entries(application.status)) {
      if (value !== null && value !== undefined) {
        if (!Array.isArray(mappedStatus[key])) {
          mappedStatus[key] = []
        }
      mappedStatus[key].push(String(value))
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

      if (msigData.robust !== application.allocatorMultisigAddress) {
        allocatorId = msigData.robust
      }

      const fetchedSigners = msigData.multisig.signers
      if (
        JSON.stringify(fetchedSigners) !==
        JSON.stringify(application.allocatorMultisigSigners)
      ) {
        updatedSigners = fetchedSigners
      }
    } catch (err) {
      /* Note to future maintainers: if *any part* of this fails,
        we must keep the old values otherwise things can get
        wacky. If you introduce code later which can cause
        exceptions from anywhere other than `getMultisigInfo`
        then make sure you maintain this promise!
      */

      console.error(
        `mapApplicationToPullRequestFile: failed to fetch Filfox info for ${
          application.allocatorMultisigAddress
        }:`,
        err
      )
    }
  }

  return {
    application_number: application?.applicationPullRequest?.prNumber,
    address: application.applicantAddress,
    name: application.applicantName,
    allocator_id: allocatorId,
    organization: application.applicantOrgName,
    allocation_bookkeeping: application.allocationBookkeepingRepo,
    metapathway_type: '',
    ma_address: '',
    pathway_addresses: {
      msig: allocatorId,
      signer: updatedSigners,
    },
    associated_org_addresses: application.applicantOrgAddresses,
    application: {
      allocations: application.allocationStandardizedAllocations,
      audit: application.allocationAudit ? [application.allocationAudit] : [],
      distribution: application.allocationDistributionRequired ? [application.allocationDistributionRequired] : [],
      tranche_schedule: application.allocationTrancheSchedule,
      required_sps: application.allocationRequiredStorageProviders,
      required_replicas: application.allocationRequiredReplicas,
      tooling: application.allocationTooling,
      max_DC_client: application.allocationMaxDcClient,
      github_handles: [application.applicantGithubHandle, ...application.applicantOtherGithubHandles ?? []],
      allocation_bookkeeping: application.allocationBookkeepingRepo,
      client_contract_address: "",
    },
    history: mappedStatus,
    audit_outcomes: lifeCycle,
    old_allocator_id: "",
  }
}
