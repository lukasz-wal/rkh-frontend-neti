import { ICommandBus, Logger } from '@filecoin-plus/core'
import { Container } from 'inversify'

import { ILotusClient } from '@src/infrastructure/clients/lotus'
import { TYPES } from '@src/types'
import { methods as m } from '@keyko-io/filecoin-verifier-tools'
import { UpdateDatacapAllocationCommand } from './update-datacap-allocation'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import config from '@src/config'

const VERIFIED_REGISTRY_ACTOR_ADDRESS = 'f06'

const schema = {
  type: 'hamt',
  key: 'address',
  value: 'bigint',
}
const methods = m.testnet // TODO: Make this configurable

export async function subscribeDatacapAllocations(container: Container) {
  const lotusClient = container.get<ILotusClient>(TYPES.LotusClient)
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus)
  const logger = container.get<Logger>(TYPES.Logger)
  const applicationDetailsRepository = container.get<IApplicationDetailsRepository>(TYPES.ApplicationDetailsRepository)
  const datacapCache = new Map<string, bigint>()

  logger.info('Subscribing to datacap allocations')
  setInterval(async () => {
    const head = await lotusClient.getChainHead()
    const actor = await lotusClient.getActor(VERIFIED_REGISTRY_ACTOR_ADDRESS, head.Cids)
    const verifiers = (await lotusClient.getChainNode(`${actor.Head['/']}/1`)).Obj

    const dta = methods.decode(schema, verifiers)
    for (const it of await dta.asList(async (a) => {
      const res = await lotusClient.getChainNode(a)
      return res.Obj
    })) {
      if (datacapCache.get(it[0]) === it[1]) {
        logger.debug(`Datacap allocation for ${it[0]} is up to date`)
        continue
      }

      const actorId = await lotusClient.getActorId(it[0])
      const allocator = await applicationDetailsRepository.getByActorId(actorId)
      if (!allocator) {
        // logger.warn(`Allocator not found for actor id ${actorId}`)
        continue
      }

      logger.info(`Updating datacap allocation for ${allocator.id} to ${it[1]}`)
      await commandBus.send(new UpdateDatacapAllocationCommand(allocator.id, it[1]))
      datacapCache.set(it[0], it[1])
      break
    }
  }, config.SUBSCRIBE_DATACAP_ALLOCATIONS_POLLING_INTERVAL)
}
