import { ApplicationStatus } from '@src/domain/application/application'

interface ApplicationDetails {
  id: string
  number: number
  name: string
  organization: string
  actorId?: string
  address: string
  github: string
  location: string
  type: string
  datacap: number
  status: ApplicationStatus
  applicationDetails?: {
    pullRequestUrl: string
    pullRequestNumber: number
  }
  rkhPhase?: {
    approvals: string[]
    approvalThreshold?: number
  }
}

export { ApplicationDetails }
