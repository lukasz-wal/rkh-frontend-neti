import { ApplicationInstruction, DatacapAllocator } from '@src/domain/application/application'

export type ApplicationPullRequestFile = {
  application_number: number
  address: string
  name: string
  organization: string
  location: string
  status: 'Active'
  metapathway_type: 'Automatic'
  associated_org_addresses: string[]
  application: {
    allocations: {
      standardized: string[]
    }
    target_clients: string[]
    required_sps: string
    required_replicas: string
    tooling: any[]
    data_types: string[]
    '12m_requested': string
    github_handles: string[]
    allocation_bookkeeping: string
  }
  poc: {
    slack: string
    github_user: string
  }
  application_instructions: ApplicationInstruction[],
  pathway_addresses?: {
    msig: string
    signer: string[]
  }
}

export function mapApplicationToPullRequestFile(application: DatacapAllocator): ApplicationPullRequestFile {
  return {
    application_number: 1337,
    address: application.applicantAddress,
    name: application.applicantName,
    organization: application.applicantOrgName,
    location: application.applicantLocation,
    status: 'Active',
    metapathway_type: 'Automatic',
    associated_org_addresses: [application.applicantAddress, ...application.applicantOrgAddresses],
    application: {
      allocations: {
        standardized: application.allocationStandardizedAllocations,
      },
      target_clients: application.allocationTargetClients,
      required_sps: application.allocationRequiredStorageProviders,
      required_replicas: application.allocationRequiredReplicas,
      tooling: application.allocationTooling,
      data_types: application.allocationDataTypes,
      '12m_requested': application.allocationProjected12MonthsUsage,
      github_handles: [application.applicantGithubHandle],
      allocation_bookkeeping: application.allocationBookkeepingRepo,
    },
    poc: {
      slack: application.applicantSlackHandle,
      github_user: application.applicantGithubHandle,
    },
    application_instructions: application.applicationInstructions.map(instruction => ({
      method: instruction.method,
      amount: instruction.amount,
    })) || [],
    pathway_addresses: application.allocatorMultisigAddress
      ? {
          msig: application.allocatorMultisigAddress,
          signer: application.allocatorMultisigSigners || [],
        }
      : undefined,
  }
}
