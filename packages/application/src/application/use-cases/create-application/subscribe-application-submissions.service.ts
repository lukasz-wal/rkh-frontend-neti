import { ICommandBus } from '@filecoin-plus/core'
import { Container } from 'inversify'

import { CreateApplicationCommand } from '@src/application/use-cases/create-application/create-application.command'
import { IAirtableClient } from '@src/infrastructure/clients/airtable'
import { TYPES } from '@src/types'
import config from '@src/config'

const MIN_APPLICATION_NUMBER = 1000
const MAX_APPLICATION_NUMBER = 9999

export async function subscribeApplicationSubmissions(container: Container) {
  const airtableClient = container.get<IAirtableClient>(TYPES.AirtableClient)
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus)
  const processedRecords = new Set<string>()

  setInterval(async () => {
    try {
      const newRecords = await airtableClient.getTableRecords()

      for (const record of newRecords) {
        if (shouldProcessRecord(record, processedRecords)) {
          const command = mapRecordToCommand(record)
          await commandBus.send(command)
          processedRecords.add(record.id)
        }
      }
    } catch (error) {
      console.error('Error processing application submissions:', error)
    }
  }, config.SUBSCRIBE_APPLICATION_SUBMISSIONS_POLLING_INTERVAL)
}

function shouldProcessRecord(record: any, processedRecords: Set<string>): boolean {
  return (
    !processedRecords.has(record.id) &&
    isRecordValid(record) &&
    isApplicationNumberInRange(Number(record.fields['Application Number']))
  )
}

function isRecordValid(record: any): boolean {
  const requiredFields = ['Allocator Pathway Name', 'Application Number', 'Multisig Address']
  return requiredFields.every((field) => field in record.fields)
}

function isApplicationNumberInRange(applicationNumber: number): boolean {
  return applicationNumber >= MIN_APPLICATION_NUMBER && applicationNumber <= MAX_APPLICATION_NUMBER
}

function mapRecordToCommand(record: any): CreateApplicationCommand {
  // DONE xTODO: update CreateApplicationCommand
  return new CreateApplicationCommand({
    applicationId: record.id,
    applicationNumber: record.fields['Application Number'] as number,

    applicantName: record.fields['Allocator Pathway Name'] as string,
    applicantLocation: record.fields['Region of Operation'] as string,
    applicantGithubHandle: record.fields['GitHub ID'] as string,
    applicantSlackHandle: record.fields['Slack ID'] as string,
    applicantAddress: record.fields['Multisig Address'] as string,
    applicantOrgName: record.fields['Organization Name'] as string,
    applicantOrgAddresses: [record.fields['Organization On-Chain address'] as string],

    type: record.fields['Type Of Allocator'] as string,
    datacap: record.fields['7. DataCap requested for allocator for 12 months of activity'] as number,

    allocationTargetClients: record.fields['Target Clients'] as string[],
    allocationDataTypes: record.fields['Type of data'] as string[],
    allocationRequiredReplicas: record.fields['Replicas required, verified by CID checker'] as string,
    allocationRequiredStorageProviders: record.fields['Number of Storage Providers required'] as string,
    allocationStandardizedAllocations: [
      record.fields['Standardized DataCap Schedule - First Allocation (TiB):'],
      record.fields['Standardized DataCap Schedule - Second Allocation (TiB):'],
      record.fields['Standardized DataCap Schedule - Third Allocation (TiB):'],
      record.fields['Standardized DataCap Schedule - Fourth Allocation (TiB):'],
    ].filter(Boolean),
    allocationBookkeepingRepo: record.fields['GitHub Bookkeeping Repo Link'] as string,

    allocatorMultisigAddress: record.fields['Multisig Address'] as string | undefined,
  })
}

export function mapRecordToCommandTest(record: any): CreateApplicationCommand {
  return mapRecordToCommand(record);
}
