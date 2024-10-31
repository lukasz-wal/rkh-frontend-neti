import * as dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'

import { TYPES } from '@src/types'
import { initialize } from '@src/startup'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import { createApplicationTest } from './create-app'
import { editApplicationTest } from './edit-app'
import { ApplicationStatus, IDatacapAllocatorRepository } from '@src/domain/application/application'
import { IEventBus, Logger } from '@filecoin-plus/core'


async function main() {
    /*
    Governance review:

    phases: 
    - GOVERNANCE_REVIEW_PHASE => RKH_APPROVAL_PHASE | META_APPROVAL_PHASE => APPROVED
    - GOVERNANCE_REVIEW_PHASE is triggered after KYC is completed

    events:
    - GovernanceReviewApproved => status = RKH_APPROVAL_PHASE | META_APPROVAL_PHASE
    - MetaAllocatorApprovalStarted => status = META_APPROVAL_PHASE
    - RKHApprovalStarted => status = RKH_APPROVAL_PHASE
    - MetaAllocatorApprovalCompleted => status = APPROVED

    Test:
    1. Create a new application
    2. Update status to ApplicationStatus.GOVERNANCE_REVIEW_PHASE
    3. Call allocator.approveGovernanceReview()
    4. Check if status becomes RKH_APPROVAL_PHASE | META_APPROVAL_PHASE

    TODO(s):
    
    - Remove uneccessary code (guid 2) approval events
    - Error handling (add throw() statements)

    */

    let applicationId = 'app-test-1730202038'
    const testEdit = false

    const applicationInstructionDict = {
        method: ['RKH_ALLOCATOR', 'META_ALLOCATOR'],
        amount: [10, 20],
        timestamp: [0, 1]
    }

    // let applicationId;

    const container = await initialize()
    const logger = container.get<Logger>(TYPES.Logger)

    // Initialize RabbitMQ as subscribe to events
    const eventBus = container.get<IEventBus>(TYPES.EventBus)
    try {
        // TODO: needed for RabbitMQ await eventBus.init();
        await eventBus.subscribeEvents()
        logger.info('Event bus initialized successfully')
    } catch (error) {
        logger.error('Failed to initialize event bus ', { error })
        process.exit(1)
    }

    const applicationDetailsRepository = container.get<IApplicationDetailsRepository>(TYPES.ApplicationDetailsRepository)

    if (!applicationId) {
        const timestamp = Math.floor(Date.now() / 1000)
        applicationId = `app-test-${timestamp}`

        // 1. Create a new application
        await createApplicationTest(container, applicationId, false)
        let applicationDetails: any;
        while (true) {
            applicationDetails = await applicationDetailsRepository.getById(applicationId);
            if (applicationDetails) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        console.log("Finished creating new application with ID:", applicationDetails.applicationId)
    }

    console.log("Updating application with ID: ", applicationId)

    // 2. Simulate governance review adding application instructions:
    if (testEdit) {
        await editApplicationTest(
            container,
            applicationId,
            applicationInstructionDict,
        )
    }

    // 3. Update 'status' to ApplicationStatus.GOVERNANCE_REVIEW_PHASE
    const updated: any = {
        id: applicationId,
        status: ApplicationStatus.GOVERNANCE_REVIEW_PHASE,
    }
    if (!testEdit) {
        updated.allocationInstruction = applicationInstructionDict
    }
    await applicationDetailsRepository.update(updated)

    let updatedApplicationDetails: any = await applicationDetailsRepository.getById(applicationId)
    console.log("Allocation instructions: ", updatedApplicationDetails.allocationInstruction)
    console.log(`Status of ${applicationId} updated to:`, updatedApplicationDetails.status)

    // 4. Call allocator.approveGovernanceReview()
    const allocatorRepository = container.get<IDatacapAllocatorRepository>(TYPES.DatacapAllocatorRepository)
    const allocator = await allocatorRepository.getById(applicationId)

    if (!testEdit) {
        allocator.applicationInstructionAmount = applicationInstructionDict.amount
        allocator.applicationInstructionMethod = applicationInstructionDict.method
    }
    allocator.applicationStatus = ApplicationStatus.GOVERNANCE_REVIEW_PHASE

    allocator.approveGovernanceReview()
    allocatorRepository.save(allocator, -1)  // needed for event handlers to trigger

    await new Promise(resolve => setTimeout(resolve, 1000))

    updatedApplicationDetails = await applicationDetailsRepository.getById(applicationId)
    console.log(`Status of ${applicationId} updated to:`, updatedApplicationDetails.status)

}


if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
