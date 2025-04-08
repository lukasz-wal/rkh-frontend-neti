import { ICommandBus, Logger } from '@filecoin-plus/core'
import { Container } from 'inversify'

import { ILotusClient } from '@src/infrastructure/clients/lotus'
import { TYPES } from '@src/types'
import { methods as m } from '@keyko-io/filecoin-verifier-tools'
import config from '@src/config'
import { CreateRefreshApplicationCommand } from '../create-application/create-refresh-application.command'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import { ApplicationDetails } from '@src/infrastructure/respositories/application-details.types'
import { ApplicationAllocator, ApplicationInstruction } from '@src/domain/application/application'


const schema = {
    type: 'hamt',
    key: 'address',
    value: 'bigint',
}
const verSchema = [
    "address",
    "cid",
    "cid",
    "cid",
    "int",
    "cid"
]
const methods = m.mainnet


export async function fetchCurrentDatacapCache(container: Container): Promise<Map<string, bigint>> {
    const lotusClient = container.get<ILotusClient>(TYPES.LotusClient)

    const head = await lotusClient.getChainHead()
    const actor = await lotusClient.getActor(config.VERIFIED_REGISTRY_ACTOR_ADDRESS, head.Cids)
    const verRegState = await lotusClient.getChainObj(actor.Head)
    const verLnks = methods.decode(verSchema, verRegState)
    const verifiers = (await lotusClient.getChainObj(verLnks[1]))
    const dta = methods.decode(schema, verifiers)
    const datacapCache = new Map<string, bigint>()

    for (const it of await dta.asList(async (a) => {
        const res = await lotusClient.getChainObj(a)
        //todo: decode?
        return res
    })) {
        datacapCache.set(it[0], it[1])
    }
    return datacapCache
}


export async function submitRefreshRKHAllocatorCommand(
    applicationDetails: ApplicationDetails,
    currentDatacapCache: Map<string, bigint>,
    minThresholdPct: number,
    commandBus: ICommandBus,
    logger: Logger,
) {
    if (applicationDetails.status !== 'APPROVED') {
        logger.debug(`Application status must be 'APPROVED'.`)
        return
    }
    const actorId = applicationDetails.actorId
    // Ensure actorId is a string and defined
    if (typeof actorId !== 'string' || !actorId) {
        logger.debug(`Invalid actorId: ${actorId}`)
        return
    }
    // Ensure applicationInstruction is defined
    if (!applicationDetails.applicationInstructions) {
        logger.debug('Missing applicationInstructions.')
        return
    }
    // Ensure lastInstruction method and amount exists
    let applicationInstructionsLength: number
    let lastInstruction: ApplicationInstruction
    let lastInstructionMethod: string
    let lastInstructionAmount: number
    try {
        applicationInstructionsLength = applicationDetails.applicationInstructions.length
        lastInstruction = applicationDetails.applicationInstructions[applicationInstructionsLength - 1]
        lastInstructionMethod = lastInstruction.method
        lastInstructionAmount = lastInstruction.datacap_amount
    } catch (error) {
        logger.debug('Invalid applicationInstructions.')
        return
    }
    // Ensure instruction method is RKH_ALLOCATOR 
    if (lastInstructionMethod !== ApplicationAllocator.RKH_ALLOCATOR) {
        logger.debug('Invalid applicationInstruction method')
        return
    }
    const initialDatacap = lastInstructionAmount
    // Ensure initialDatacap is a number and defined
    if (typeof initialDatacap !== 'number' || isNaN(initialDatacap)) {
        logger.debug(`Invalid initialDatacap: ${initialDatacap}`)
        return
    }
    // Ensure we have a current datacap for the allocator
    if (!currentDatacapCache.has(actorId)) {
        logger.debug(`Missing currentDatacap for actorId: ${actorId}`)
        return
    }
    try {
        const currentDatacap = currentDatacapCache.get(actorId)
        const pct = (Number(currentDatacap) / Number(initialDatacap)) * 100
        if (pct <= minThresholdPct) {          
            const applicationId = applicationDetails.id          
            const command = new CreateRefreshApplicationCommand(applicationId)
            await commandBus.send(command)
        }
    } catch (error) {
        console.error(error)
    }
}


export async function subscribeRefreshRKH(container: Container) {
    const logger = container.get<Logger>(TYPES.Logger)
    const commandBus = container.get<ICommandBus>(TYPES.CommandBus)

    let shouldContinue = true

    const intervalId = setInterval(async () => {
        if (!shouldContinue) {
            logger.info("Unsubscribing from Refresh RKH...")
            clearInterval(intervalId)
            return
        }
        logger.info("Subscribing to Refresh RKH...")

        const currentDatacapCache = await fetchCurrentDatacapCache(container)
        console.log('currentDatacapCache', currentDatacapCache)
        const applicationDetailsRepository = container.get<IApplicationDetailsRepository>(TYPES.ApplicationDetailsRepository)
        const applications = await applicationDetailsRepository.getAll()

        for (const applicationDetails of applications) {
            await submitRefreshRKHAllocatorCommand(
                applicationDetails,
                currentDatacapCache,
                config.REFRESH_MIN_THRESHOLD_PCT,
                commandBus,
                logger,
            )
        }

    }, config.SUBSCRIBE_REFRESH_RKH_POLLING_INTERVAL)

    return () => {
        shouldContinue = false
    }

}
