import { ICommandBus } from "@filecoin-plus/core";
import { Container } from "inversify";

import { CreateApplicationCommand } from "@src/application/commands";
import { IAirtableClient } from "@src/infrastructure/clients/airtable";
import { TYPES } from "@src/types";

const START_INDEX = 1098;

export async function subscribeApplicationSubmissions(container: Container) {
  // Get the Airtable client from the container
  const client = container.get<IAirtableClient>(TYPES.AirtableClient);

  // Get the command bus from the container
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);

  setInterval(async () => {
    const newRecords = await client.getTableRecords(START_INDEX);
    for (const record of newRecords) {
      if (!record.fields["1. Notary Allocator Pathway Name"]) {
        continue;
      }

      await commandBus.send(
        new CreateApplicationCommand({
          applicationNumber: record.fields["number"] as number,
          allocatorPathwayName: record.fields[
            "1. Notary Allocator Pathway Name"
          ] as string,
          organizationName: record.fields["2. Organization"] as string,
          onChainAddress: record.fields[
            "3. On-chain address for Allocator"
          ] as string,
          githubUsername: record.fields["52. GitHub Handles:"] as string,
          country: record.fields["Scrubbed Country of Operation"] as string,
          region: record.fields["5. Region of Operation"] as string,
          type: record.fields["6. Type Of Allocator"] as string,
          datacap: record.fields[
            "7. DataCap requested for allocator for 12 months of activity"
          ] as number,
          targetClients: record.fields[
            "10. Who are your target clients?"
          ] as string[],
          dataTypes: record.fields[
            "17. What type(s) of data would be applicable for your pathway?"
          ] as string[],
          requiredReplicas: record.fields[
            "22. How many replicas will you require to meet programmatic requirements for distribution?"
          ] as string,
          requiredOperators: record.fields[
            "24. How many Storage Provider owner/operators will you require to meet programmatic requirements for distribution?"
          ] as string,
          standardizedAllocations: record.fields[
            "29. Will you use standardized DataCap allocations to clients?"
          ] as string,
        })
      );
    }
  }, 10000);
}
