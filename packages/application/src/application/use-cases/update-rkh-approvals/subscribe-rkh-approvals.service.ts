import { ICommandBus, Logger } from '@filecoin-plus/core'
import { VerifyAPI } from '@keyko-io/filecoin-verifier-tools'
import { Container } from 'inversify'

import { ILotusClient } from '@src/infrastructure/clients/lotus'
import { TYPES } from '@src/types'
import { methods as m } from '@keyko-io/filecoin-verifier-tools'
import config from '@src/config'
import { UpdateRKHApprovalsCommand } from './update-rkh-approvals.command'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'

const RHK_MULTISIG_ACTOR_ADDRESS = 'f080'
const VERIFIED_REGISTRY_ACTOR_METHODS = {
  ADD_VERIFIER: 2,
}
const methods = m.mainnet
const msigSchema = [
  ["list", "address"], //signers
  "int", // num_approvals_threshold
  "int", //next_tx_id
  "int", //initial_balance
  "int", // start_epoch
  "int", // unlock_duration
  "cid" //pending_txs
]

type dTXN = {
  to: string
  value:  BigInt
  method: number
  params: string
  signers: [string]
}


export async function subscribeRKHApprovals(container: Container) {
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus)
  const logger = container.get<Logger>(TYPES.Logger)
  const applicationDetailsRepository = container.get<IApplicationDetailsRepository>(TYPES.ApplicationDetailsRepository)
  const lotusClient = container.get<ILotusClient>(TYPES.LotusClient)


  logger.info('Subscribing to RKH proposals')
  setInterval(async () => {
    const head = await lotusClient.getChainHead()
    const actor = await lotusClient.getActor(RHK_MULTISIG_ACTOR_ADDRESS, head.Cids)
    const actorState = await lotusClient.getChainObj(actor.Head)


    const msigStateRaw = await lotusClient.getChainObj(actor.Head)
    const msigData = methods.decode(msigSchema, msigStateRaw)
    const pendingRaw = await lotusClient.getChainObj(msigData[6])

    const info = methods.decode(methods.pending, pendingRaw)
    const obj = await info.asObject(async a => {
      return await lotusClient.getChainObj(a)
    })
    let pendingTxs:any = []
    for (const [k, v] of Object.entries<dTXN>(obj)) {
      const parse = methods.parse(v)
      if (parse.signers[0].to == config.VERIFIED_REGISTRY_ACTOR_ADDRESS && parse.signers[0].method == VERIFIED_REGISTRY_ACTOR_METHODS.ADD_VERIFIER) {
        pendingTxs.push({
          id: parseInt(k),
          tx: { ...v, from: v.signers[0]},
          parsed: parse,
          signers: v.signers,
        })
      }
    }


    /*
    const pendingTxs = (await api.pendingTransactions(RHK_MULTISIG_ACTOR_ADDRESS))?.filter(
      (tx: any) =>
        tx?.tx.to == config.VERIFIED_REGISTRY_ACTOR_ADDRESS && tx?.tx.method == VERIFIED_REGISTRY_ACTOR_METHODS.ADD_VERIFIER,
    )
    */
    logger.info(`Found ${pendingTxs.length} pending transactions`)

    for (const tx of pendingTxs) {
      const applicationDetails = await applicationDetailsRepository.getByAddress(tx.parsed.params.verifier)
      if (!applicationDetails) {
        console.log('Application details not found for address', tx.parsed.params.verifier)
        continue
      }
      try {
        await commandBus.send(new UpdateRKHApprovalsCommand(applicationDetails.id, tx.id, tx.tx.signers))
      
      } catch (error) {
        console.error('Error updating RKH approvals', { error })
        }
      }
  }, config.SUBSCRIBE_RKH_APPROVALS_POLLING_INTERVAL)
}
