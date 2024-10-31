import { ICommandBus, Logger } from '@filecoin-plus/core'
import { Container } from 'inversify'
import { TYPES } from '@src/types'
import { UpdateMetaAllocatorApprovalsCommand } from '@src/application/use-cases/update-ma-approvals/update-ma-approvals.command'
import { IApplicationDetailsRepository } from '@src/infrastructure/respositories/application-details.repository'
import config from '@src/config'
import { ethers } from 'ethers';
import { MongoClient } from 'mongodb'


// class TxReceiptsFetcher {
//   url: string
//   method: string

//   constructor(url: string) {
//     this.url = url
//     this.method = 'eth_getBlockReceipts'
//   }

//   async fetch(blockNumber: number | string) {
//     const headers = {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Accept-Encoding': 'gzip',
//     }

//     let paramsBlockNumber = blockNumber !== 'latest' ? Web3.utils.toHex(blockNumber) : blockNumber
//     const body = {
//       id: 1,
//       jsonrpc: '2.0',
//       method: this.method,
//       params: [{ blockNumber: paramsBlockNumber }],
//     }

//     try {
//       const response = await axios.post(this.url, body, { headers })
//       return response
//     } catch (error) {
//       return null
//     }
//   }

//   async robustFetch(blockNumber: number | string) {
//     console.log(`[Block-${blockNumber}] Fetching...`)
//     let attempt = 1

//     while (true) {
//       const res = await this.fetch(blockNumber)
//       if (!res) {
//         console.log(`[Block-${blockNumber}] [Attempt-${attempt}] Retrying...`)
//         attempt++
//         await new Promise(resolve => setTimeout(resolve, 1000))
//         continue
//       }

//       const [data, isValid] = this.validate(res)
//       if (isValid) {
//         return data
//       } else {
//         attempt++
//         console.log(`[Block-${blockNumber}] [Attempt-${attempt}] Retrying...`)
//         await new Promise(resolve => setTimeout(resolve, 1000))
//       }
//     }
//   }

//   _validateData(txReceipts: any, blockNumber = null) {
//     if (!txReceipts || typeof txReceipts !== 'object' || !txReceipts.data || !txReceipts.data.result) {
//       console.log(`[Block-${blockNumber}] [Tx-Receipts-Fetcher] Invalid data structure.`)
//       return null
//     }

//     const receipts = txReceipts.data.result
//     try {
//       if (receipts.length > 0 && receipts[0].blockHash) {
//         return txReceipts.data
//       }
//     } catch (exception) {
//       console.log(`[Block-${blockNumber}] [Tx-Receipts-Fetcher] Receipts do not have blockHash. Retrying...`)
//       return null
//     }
//   }

//   validate(res: any) {
//     if (res.status !== 200) {
//       console.log('Invalid response: status code is', res.status)
//       return [null, false]
//     }

//     try {
//       const data = this._validateData(res)
//       if (data) {
//         return [data, true]
//       }
//     } catch (error: any) {
//       console.log('Invalid response:', error.message)
//       return [null, false]
//     }

//     console.log("Invalid response: 'data' failed validate data check")
//     return [null, false]
//   }
// }


// class AllowanceChangedLogDecoder {
//   eventABI: any
//   web3: any
//   eventSignature: string

//   constructor() {
//     this.web3 = new Web3()
//     this.eventSignature = '0xd30aeeeb3755c0784618bd3ff45998e5b4be082df174ed87c3a79f37e2fb56a6'
//     this.eventABI = {
//       type: "event",
//       name: "AllowanceChanged",
//       inputs: [
//         {
//           name: "allocator",
//           type: "address",
//           indexed: true,
//           internalType: "address"
//         },
//         {
//           name: "allowanceBefore",
//           type: "uint256",
//           indexed: false,
//           internalType: "uint256"
//         },
//         {
//           name: "allowanceAfter",
//           type: "uint256",
//           indexed: false,
//           internalType: "uint256"
//         }
//       ],
//       anonymous: false
//     }
//   }

//   decode(log: any, txHash: string, blockNumber: string) {
//     try {
//       const numTopics = log.topics.length
//       if (numTopics < 2) {
//         return null
//       }
//       if (this.eventSignature !== log.topics[0]) {
//         return null
//       }
//       const nonIndexedInputs = this.eventABI.inputs.filter((input: any) => !input.indexed).map((input: any) => input.type)
//       const nonIndexedNames = this.eventABI.inputs.filter((input: any) => !input.indexed).map((input: any) => input.name)
//       const decodedData = this.web3.eth.abi.decodeParameters(nonIndexedInputs, log.data)
//       const decodedDict = {}
//       nonIndexedNames.forEach((name: string, index: number) => {
//         decodedDict[name] = decodedData[index]
//       })
//       const allocatorAddress = this.web3.utils.toChecksumAddress('0x' + log.topics[1].slice(-40))
//       decodedDict['allocatorAddress'] = allocatorAddress
//       decodedDict['contractAddress'] = log['address']
//       decodedDict['txHash'] = txHash
//       decodedDict['blockNumber'] = blockNumber
//       return decodedDict
//     } catch (error) {
//       return null
//     }
//   }
// }


// async function getApprovalsFromReceipts(receipts: any[]) {
//   const decoder = new AllowanceChangedLogDecoder()
//   const approvals: any[] = []
//   for (let receipt of receipts) {
//     if ("logs" in receipt) {
//       for (let log of receipt.logs) {
//         const txHash = receipt.transactionHash
//         const blockNumber = receipt.blockNumber
//         const decoded = decoder.decode(log, txHash, blockNumber)
//         if (decoded) {
//           approvals.push(decoded)
//         }
//       }
//     }
//   }
//   return approvals
// }


const ALLOWANCE_CHANGED_EVENT_ABI = [
  {
    "type":"event",
    "name":"AllowanceChanged",
    "inputs":[
       {
          "name":"allocator",
          "type":"address",
          "indexed":true,
          "internalType":"address"
       },
       {
          "name":"allowanceBefore",
          "type":"uint256",
          "indexed":false,
          "internalType":"uint256"
       },
       {
          "name":"allowanceAfter",
          "type":"uint256",
          "indexed":false,
          "internalType":"uint256"
       }
    ],
    "anonymous":false
 }
]


type Approval = {
  blockNumber: number,
  txHash: string,
  contractAddress: string,
  allocatorAddress: string,
  allowanceBefore: string,
  allowanceAfter: string,
}


export function ensureSubscribeMetaAllocatorApprovalsConfig() {
  const expectedConfigVars = [
    'SUBSCRIBE_META_ALLOCATOR_APPROVALS_POLLING_INTERVAL',
    'VALID_META_ALLOCATOR_ADDRESSES',
    'LOTUS_RPC_URL',
    'MONGODB_URI',
  ]
  for (let configVar of expectedConfigVars) {
    if (!config[configVar]) {
      throw new Error(`Missing config variable: '${configVar}'`)
    }
  }
}


async function fetchApprovals(fromBlock: number): Promise<any[]> {
  const provider = new ethers.providers.JsonRpcProvider(config.LOTUS_RPC_URL)
  const iface = new ethers.utils.Interface(ALLOWANCE_CHANGED_EVENT_ABI)
  const eventTopic = iface.getEventTopic("AllowanceChanged")
  const filter = {
      fromBlock: fromBlock,
      toBlock: 'latest',
      topics: [eventTopic]
  }
  let logs: any[]
  try {
    logs = await provider.getLogs(filter);
  } catch (error) {
    return []
  }

  const approvals: Approval[] = []
  for (let log of logs) {
    try {
        const decoded = iface.decodeEventLog("AllowanceChanged", log.data, log.topics)
        if (decoded) {
          const approval = {
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
            contractAddress: log.address,
            allocatorAddress: decoded.allocator,
            allowanceBefore: decoded.allowanceBefore.toString(),
            allowanceAfter: decoded.allowanceAfter.toString(),
          }
          approvals.push(approval)
        }
    } catch (error) {
      continue
    }
  }

  return approvals

}


async function fetchLastBlockMetaAllocator(databaseName: string, collectionName: string): Promise<number> {
  const client = new MongoClient(config.MONGODB_URI)
  try {
      await client.connect()
      const database = client.db(databaseName)
      const collection = database.collection(collectionName)
      const document = await collection.find({ "metaAllocator": { $exists: true } })
          .sort({ "metaAllocator.blockNumber": -1 })
          .limit(1)
          .toArray()

      if (document.length > 0) {
          return document[0].metaAllocator.blockNumber
      } else {
          return -1
      }
  } catch (error) {
      return -1
  } finally {
      await client.close()
  }
}


export async function subscribeMetaAllocatorApprovals(container: Container) {
  const logger = container.get<Logger>(TYPES.Logger)
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus)
  const applicationDetailsRepository = container.get<IApplicationDetailsRepository>(TYPES.ApplicationDetailsRepository)

  let shouldContinue = true

  const intervalId = setInterval(async () => {
    try {
      ensureSubscribeMetaAllocatorApprovalsConfig()
    } catch (error) {
      logger.error('Failed to subscribe to MetaAllocator proposals.', error)
      clearInterval(intervalId)
      return
    }

    if (!shouldContinue) {
      logger.info("Unsubscribing from MetaAllocator proposals...")
      clearInterval(intervalId)
      return
    }

    logger.info("Subscribing to MetaAllocator proposals...")

    let lastBlock = await fetchLastBlockMetaAllocator('filecoin-plus', 'applicationDetails')
    const approvals = await fetchApprovals(lastBlock + 1)
    logger.info(`Found ${approvals.length} AllowanceChanged events since block ${lastBlock + 1}.`)

    for (let approval of approvals) {
      if (config.VALID_META_ALLOCATOR_ADDRESSES.includes(approval.contractAddress)) {
        const allocatorAddress = approval.allocatorAddress
        const applicationDetails = await applicationDetailsRepository.getByAddress(allocatorAddress)
        if (!applicationDetails) {
          logger.info('Application details not found for address:', allocatorAddress)
          continue
        }
        try {
          logger.info("Sending UpdateMetaAllocatorApprovalsCommand...")
          const allocatorId = applicationDetails.id
          const command = new UpdateMetaAllocatorApprovalsCommand(allocatorId, approval.blockNumber, approval.txHash)
          await commandBus.send(command)
        } catch (error) {
          logger.error('Error updating Meta Allocator approvals', error)
        }
      } else {
        logger.debug(`Invalid contract address: ${approval.contractAddress}`)
      }
    }
  }, config.SUBSCRIBE_META_ALLOCATOR_APPROVALS_POLLING_INTERVAL)

  return () => {
    shouldContinue = false
  }

}

