import { ICommandBus, Logger } from '@filecoin-plus/core'
import { VerifyAPI } from '@keyko-io/filecoin-verifier-tools'
import { Container } from 'inversify'

import { TYPES } from '@src/types'
import config from '@src/config'
import { UpdateRKHApprovalsCommand } from './update-rkh-approvals.command'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'

const RHK_MULTISIG_ACTOR_ADDRESS = 'f080'
const VERIFIED_REGISTRY_ACTOR_ADDRESS = 'f06'
const VERIFIED_REGISTRY_ACTOR_METHODS = {
  ADD_VERIFIER: 2,
}

export async function subscribeRKHApprovals(container: Container) {
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus)
  const logger = container.get<Logger>(TYPES.Logger)
  const applicationDetailsRepository = container.get<IApplicationDetailsRepository>(TYPES.ApplicationDetailsRepository)

  // TODO: Refactor this into the lotus client.
  const api = new VerifyAPI(
    VerifyAPI.standAloneProvider(config.LOTUS_RPC_URL, {
      token: async () => {
        return config.LOTUS_AUTH_TOKEN
      },
    }),
    {},
    false, // if node != Mainnet => testnet = true
  )

  logger.info('Subscribing to RKH proposals')
  setInterval(async () => {
    const pendingTxs = (await api.pendingTransactions(RHK_MULTISIG_ACTOR_ADDRESS))?.filter(
      (tx: any) =>
        tx?.tx.to == VERIFIED_REGISTRY_ACTOR_ADDRESS && tx?.tx.method == VERIFIED_REGISTRY_ACTOR_METHODS.ADD_VERIFIER,
    )
    logger.info(`Found ${pendingTxs.length} pending transactions`)

    for (const tx of pendingTxs) {
      const applicationDetails = await applicationDetailsRepository.getByAddress(tx.parsed.params.verifier)
      if (!applicationDetails) {
        console.log('Application details not found for address', tx.parsed.params.verifier)
        continue
      }
      await commandBus.send(new UpdateRKHApprovalsCommand(applicationDetails.id, tx.tx.signers))
    }
  }, config.SUBSCRIBE_RKH_APPROVALS_POLLING_INTERVAL)
}
