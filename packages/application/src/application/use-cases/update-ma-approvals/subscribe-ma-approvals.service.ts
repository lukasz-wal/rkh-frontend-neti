import { ICommandBus, Logger } from '@filecoin-plus/core'
import { Container } from 'inversify'
import { TYPES } from '@src/types'
import { UpdateMetaAllocatorApprovalsCommand } from '@src/application/use-cases/update-ma-approvals/update-ma-approvals.command'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import config from '@src/config'
import axios from 'axios'
import Web3 from 'web3'


const SUBSCRIBE_META_ALLOCATOR_APPROVALs_POLLING_INTERVAL = 1000
const VALID_META_ALLOCATOR_ADDRESSES = ['0x15a9d9b81e3c67b95ffedfb4416d25a113c8c6df']
const RPC_URL = 'http://127.0.0.1:8545'


class TxReceiptsFetcher {
  url: string
  method: string

  constructor(url: string) {
    this.url = url
    this.method = 'eth_getBlockReceipts'
  }

  async fetch(blockNumber: number | string) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
    }

    let paramsBlockNumber = blockNumber !== 'latest' ? Web3.utils.toHex(blockNumber) : blockNumber
    const body = {
      id: 1,
      jsonrpc: '2.0',
      method: this.method,
      params: [{ blockNumber: paramsBlockNumber }],
    }

    try {
      const response = await axios.post(this.url, body, { headers })
      return response
    } catch (error) {
      return null
    }
  }

  async robustFetch(blockNumber: number | string) {
    console.log(`[Block-${blockNumber}] Fetching...`)
    let attempt = 1

    while (true) {
      const res = await this.fetch(blockNumber)
      if (!res) {
        console.log(`[Block-${blockNumber}] [Attempt-${attempt}] Retrying...`)
        attempt++
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }

      const [data, isValid] = this.validate(res)
      if (isValid) {
        return data
      } else {
        attempt++
        console.log(`[Block-${blockNumber}] [Attempt-${attempt}] Retrying...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  _validateData(txReceipts: any, blockNumber = null) {
    if (!txReceipts || typeof txReceipts !== 'object' || !txReceipts.data || !txReceipts.data.result) {
      console.log(`[Block-${blockNumber}] [Tx-Receipts-Fetcher] Invalid data structure.`)
      return null
    }

    const receipts = txReceipts.data.result
    try {
      if (receipts.length > 0 && receipts[0].blockHash) {
        return txReceipts.data
      }
    } catch (exception) {
      console.log(`[Block-${blockNumber}] [Tx-Receipts-Fetcher] Receipts do not have blockHash. Retrying...`)
      return null
    }
  }

  validate(res: any) {
    if (res.status !== 200) {
      console.log('Invalid response: status code is', res.status)
      return [null, false]
    }

    try {
      const data = this._validateData(res)
      if (data) {
        return [data, true]
      }
    } catch (error: any) {
      console.log('Invalid response:', error.message)
      return [null, false]
    }

    console.log("Invalid response: 'data' failed validate data check")
    return [null, false]
  }
}


class AllowanceChangedLogDecoder {
  eventABI: any
  web3: any
  eventSignature: string

  constructor() {
    this.web3 = new Web3()
    this.eventSignature = '0xd30aeeeb3755c0784618bd3ff45998e5b4be082df174ed87c3a79f37e2fb56a6'
    this.eventABI = {
      type: "event",
      name: "AllowanceChanged",
      inputs: [
        {
          name: "allocator",
          type: "address",
          indexed: true,
          internalType: "address"
        },
        {
          name: "allowanceBefore",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        },
        {
          name: "allowanceAfter",
          type: "uint256",
          indexed: false,
          internalType: "uint256"
        }
      ],
      anonymous: false
    }
  }

  decode(log: any, txHash: string, blockNumber: string) {
    try {
      const numTopics = log.topics.length
      if (numTopics < 2) {
        return null
      }
      if (this.eventSignature !== log.topics[0]) {
        return null
      }
      const nonIndexedInputs = this.eventABI.inputs.filter((input: any) => !input.indexed).map((input: any) => input.type)
      const nonIndexedNames = this.eventABI.inputs.filter((input: any) => !input.indexed).map((input: any) => input.name)
      const decodedData = this.web3.eth.abi.decodeParameters(nonIndexedInputs, log.data)
      const decodedDict = {}
      nonIndexedNames.forEach((name: string, index: number) => {
        decodedDict[name] = decodedData[index]
      })
      const allocatorAddress = this.web3.utils.toChecksumAddress('0x' + log.topics[1].slice(-40))
      decodedDict['allocatorAddress'] = allocatorAddress
      decodedDict['contractAddress'] = log['address']
      decodedDict['txHash'] = txHash
      decodedDict['blockNumber'] = blockNumber
      return decodedDict
    } catch (error) {
      return null
    }
  }
}


async function getApprovals(receipts: any[]) {
  const decoder = new AllowanceChangedLogDecoder()
  const approvals: any[] = []
  for (let receipt of receipts) {
    if ("logs" in receipt) {
      for (let log of receipt.logs) {
        const txHash = receipt.transactionHash
        const blockNumber = receipt.blockNumber
        const decoded = decoder.decode(log, txHash, blockNumber)
        if (decoded) {
          approvals.push(decoded)
        }
      }
    }
  }
  return approvals
}


export async function subscribeMetaAllocatorApprovals(container: Container) {
  console.log("Subscribing to MetaAllocator proposals...")

  const commandBus = container.get<ICommandBus>(TYPES.CommandBus)
  const applicationDetailsRepository = container.get<IApplicationDetailsRepository>(TYPES.ApplicationDetailsRepository)
  const fetcher = new TxReceiptsFetcher(RPC_URL)

  let lastBlock = null
  let shouldContinue = true

  const intervalId = setInterval(async () => {
    if (!shouldContinue) {
      console.log("Unsubscribing from MetaAllocator proposals...")
      clearInterval(intervalId)
      return
    }

    const data = await fetcher.robustFetch('latest')
    if (data && data.result.length > 0 && lastBlock !== data.result[0].blockNumber) {
      lastBlock = data.result[0].blockNumber

      const receipts = data.result
      const approvals = await getApprovals(receipts)
      console.log(`Block ${lastBlock}: Detected ${approvals.length} approval events.`)

      for (let approval of approvals) {
        if (VALID_META_ALLOCATOR_ADDRESSES.includes(approval.contractAddress)) {
          const allocatorAddress = approval.allocatorAddress
          const applicationDetails = await applicationDetailsRepository.getByAddress(allocatorAddress)
          if (!applicationDetails) {
            console.log('Application details not found for address:', allocatorAddress)
            continue
          }
          try {
            console.log("Sending UpdateMetaAllocatorApprovalsCommand...")
            const allocatorId = applicationDetails.id
            const command = new UpdateMetaAllocatorApprovalsCommand(allocatorId, approval.blockNumber, approval.txHash)
            await commandBus.send(command)
          } catch (error) {
            console.error('Error updating Meta Allocator approvals', error)
          }
        }
      }
    }
  }, SUBSCRIBE_META_ALLOCATOR_APPROVALs_POLLING_INTERVAL)

  return () => {
    shouldContinue = false
  }

}

// TODO: handle rejections
