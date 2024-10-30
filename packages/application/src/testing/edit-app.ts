import * as dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'
import '@src/api/http/controllers/index.js'
import '@src/api/http/controllers/admin.controller'

import { MongoClient } from 'mongodb'
import { Container } from 'inversify'
import { TYPES } from '@src/types'
import { ICommandBus } from '@filecoin-plus/core'
import { initialize } from '@src/startup'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import { IGithubClient } from '@src/infrastructure/clients/github'
import { ApplicationPullRequestFile } from '@src/application/services/pull-request.types'
import { EditApplicationCommand } from '@src/application/use-cases/edit-application/edit-application.command'
import config from '@src/config'


const MONGO_URI = 'mongodb+srv://filecoin-plus:m6CEYieBTc0Y7kLs@ragnarokdemocluster.4zqzb.mongodb.net'


async function fetchApplicationDocumentById(applicationId: string, databaseName: string, collectionName: string) {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);
        const document = await collection.findOne({ applicationId: applicationId });
        if (document) {
            return document;
        } else {
            console.log("No document found with the specified applicationId.");
        }
    } catch (error) {
        console.error('Error accessing MongoDB collection:', error);
    } finally {
        await client.close();
    }
}


export async function editApplicationTest(
    container: Container,
    targetApplicationId: string,
    applicationInstructionDict: { method: string[], amount: number[], timestamp: number[] },
) {

    const commandBus = container.get<ICommandBus>(TYPES.CommandBus)
    const githubClient = container.get<IGithubClient>(TYPES.GithubClient)
    const applicationRepository = container.get<IApplicationDetailsRepository>(TYPES.ApplicationDetailsRepository)
    const applications = await applicationRepository.getAll()

    for (const application of applications) {

        if (application.id !== targetApplicationId) {
            continue
        }

        const pullRequestNumber = application.applicationDetails?.pullRequestNumber
        if (!pullRequestNumber) {
            console.log(`No GitHub PR found for application: ${application.id}`)
            break    
        }
        console.log("Found applicaiton with ID: ", application.id)

        // Fetch the PR details
        const prDetails = await githubClient.getPullRequest(
            config.GITHUB_OWNER,
            config.GITHUB_REPO,
            pullRequestNumber,
        )

        // Get the contents of the allocators.json file from the PR branch
        const file = await githubClient.getFile(
            config.GITHUB_OWNER,
            config.GITHUB_REPO,
            `allocators/${application.id}.json`,
            prDetails.head.ref,
        )

        // Parse the JSON content
        const applicationPullRequestFile = JSON.parse(file.content) as ApplicationPullRequestFile

        // Update the application data
        const command = new EditApplicationCommand({
            applicationId: application.id,
            applicationNumber: applicationPullRequestFile.application_number,

            applicantName: applicationPullRequestFile.name,
            applicantLocation: applicationPullRequestFile.location,
            applicantGithubHandle: applicationPullRequestFile.poc.github_user,
            applicantSlackHandle: applicationPullRequestFile.poc.slack,
            applicantAddress: applicationPullRequestFile.address,
            applicantOrgName: applicationPullRequestFile.organization,
            applicantOrgAddresses: applicationPullRequestFile.associated_org_addresses.filter(
                (address) => address !== applicationPullRequestFile.address,
            ),
            allocationStandardizedAllocations: applicationPullRequestFile.application.allocations.standardized,
            allocationTargetClients: applicationPullRequestFile.application.target_clients,
            allocationRequiredReplicas: applicationPullRequestFile.application.required_replicas,
            allocationRequiredStorageProviders: applicationPullRequestFile.application.required_sps,

            allocationTooling: applicationPullRequestFile.application.tooling,
            allocationDataTypes: applicationPullRequestFile.application.data_types,
            allocationProjected12MonthsUsage: applicationPullRequestFile.application['12m_requested'],
            allocationBookkeepingRepo: applicationPullRequestFile.application.allocation_bookkeeping,

            applicationInstructionMethod: applicationInstructionDict.method,
            applicationInstructionAmount: applicationInstructionDict.amount,
        })

        await commandBus.send(command)
    }

}


async function main() {
    /*
    Expected output:

    Assumption: PR has been made to update the JSON with:

    "allocation_instruction": {
        "method": ['rkh-allocator', 'meta-allocator'],
        "amount": [10, 20],
        "timestamp": [0, 1]
    }

    Expected output:
    
    MongoDB document now contains:

    allocationInstruction: {
        method: [ 'rkh-allocator', 'meta-allocator' ],
        amount: [ 10, 20 ],
        timestamp: [ 0, 1 ]
    }

    TODO: Simulate an actual PR with an edit
    */

    const container = await initialize()    
    const targetApplicationId = 'app-test-1730107971'

    const newApplicationInstructionDict = {
        method: ['rkh-allocator', 'meta-allocator'],
        amount: [10, 20],
        timestamp: [0, 1]
    }

    await editApplicationTest(
        container,
        targetApplicationId,
        newApplicationInstructionDict,
    )

    console.log("Checking updated application document...")
    const applicationDocument = await fetchApplicationDocumentById(
        targetApplicationId,
        'filecoin-plus',
        'applicationDetails'
    )
    console.log(applicationDocument);

}


if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
