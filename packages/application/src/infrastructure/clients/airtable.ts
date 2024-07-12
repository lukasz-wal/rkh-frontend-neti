import Airtable from "airtable";

import { inject, injectable } from "inversify";
import { TYPES } from "@src/types";

export type AirtableRecord = {
  id: string;
  fields: { [key: string]: any };
};

export interface IAirtableClient {
  getTableRecords(): Promise<AirtableRecord[]>;
}

/**
 * Configuration options for AirtableClient
 */
export interface AirtableClientConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

@injectable()
export class AirtableClient implements IAirtableClient {
  private readonly base: Airtable.Base;

  private lastProcessedTimestamp: string | null = null;

  constructor(
    @inject(TYPES.AirtableClientConfig)
    private readonly config: AirtableClientConfig
  ) {
    this.base = new Airtable({ apiKey: config.apiKey }).base(config.baseId!);
  }

  async getTableRecords(): Promise<AirtableRecord[]> {
    const table = this.base(this.config.tableName);
    try {
      const formula = this.lastProcessedTimestamp
        ? `IS_AFTER({Create Time}, DATETIME_PARSE('${this.lastProcessedTimestamp}'))`
        : "";

      const records = await table
        .select({
          filterByFormula: formula,
          sort: [{ field: "Create Time", direction: "asc" }],
        })
        .all();
      //const records = await table.select().all();

      for (const record of records) {
        this.lastProcessedTimestamp = record.fields["Create Time"] as string;
        console.log("Last processed timestamp:", this.lastProcessedTimestamp);
      }

      return records.map((record: any) => ({
        // TODO: Any type
        id: record.id,
        fields: record._rawJson.fields,
      }));
    } catch (error) {
      console.error("Error fetching records from Airtable:", error);
      return [];
    }
  }
}