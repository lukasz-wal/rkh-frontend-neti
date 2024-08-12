import { Logger } from "@filecoin-plus/core";
import Airtable, { Records } from "airtable";
import { inject, injectable } from "inversify";
import { Collection, Db } from "mongodb";

import { TYPES } from "@src/types";

/**
 * Represents an Airtable record.
 */
export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

/**
 * Interface for the Airtable client.
 */
export interface IAirtableClient {
  /**
   * Retrieves records from the Airtable.
   * @param startFrom Optional application number to start fetching records from.
   * @returns A promise that resolves to an array of AirtableRecords.
   */
  getTableRecords(startFrom?: number): Promise<AirtableRecord[]>;
}

/**
 * Configuration options for AirtableClient.
 */
export interface AirtableClientConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

/**
 * Implements the IAirtableClient interface to interact with Airtable.
 */
@injectable()
export class AirtableClient implements IAirtableClient {
  private readonly base: Airtable.Base;
  private readonly recordsCollection: Collection;

  /**
   * Constructs a new AirtableClient instance.
   * @param config The configuration options for the Airtable client.
   * @param db The MongoDB database instance.
   */
  constructor(
    @inject(TYPES.Logger)
    private readonly logger: Logger,
    @inject(TYPES.AirtableClientConfig)
    private readonly config: AirtableClientConfig,
    @inject(TYPES.Db)
    private readonly db: Db,
  ) {
    this.base = new Airtable({ apiKey: config.apiKey }).base(config.baseId);
    this.recordsCollection = this.db.collection("airtable-client:records");
  }

  /**
   * Retrieves records from the Airtable.
   * @param startFrom Optional application number to start fetching records from.
   * @returns A promise that resolves to an array of AirtableRecords.
   * @throws Error if there's an issue fetching records from Airtable.
   */
  async getTableRecords(startFrom?: number): Promise<AirtableRecord[]> {
    const lastProcessedId = await this.getLastProcessedId(startFrom);
    const table = this.base(this.config.tableName);

    try {
      const records = await this.fetchRecordsFromAirtable(table, lastProcessedId);
      if (records.length === 0) {
        return [];
      }

      await this.saveProcessedRecords(records);

      return this.mapAirtableRecords(records);
    } catch (error) {
      this.logger.error("Error fetching records from Airtable:", error);
      throw new Error("Failed to fetch records from Airtable");
    }
  }

  /**
   * Retrieves the last processed record ID from the database.
   * @param startFrom Optional starting point for fetching records.
   * @returns The last processed record ID or the provided startFrom value.
   */
  private async getLastProcessedId(startFrom?: number): Promise<number | undefined> {
    const lastRecord = await this.recordsCollection.findOne({}, { sort: { 'number': -1 } });
    return lastRecord?.number ?? startFrom;
  }

  /**
   * Fetches records from Airtable.
   * @param table The Airtable table to fetch records from.
   * @param lastProcessedId The ID of the last processed record.
   * @returns An array of fetched Airtable records.
   */
  private async fetchRecordsFromAirtable(table: Airtable.Table<any>, lastProcessedId?: number): Promise<Records<any>> {
    this.logger.info(`Fetching records from Airtable starting from ID: ${lastProcessedId}`);
    const formula = lastProcessedId ? `{number} > ${lastProcessedId}` : "";
    const records = await table.select({
      filterByFormula: formula,
      sort: [{ field: "number", direction: "asc" }],
    }).all();
    this.logger.info(`Fetched ${records.length} records from Airtable`);
    return records;
  }

  /**
   * Saves the processed records to the database.
   * @param records The Airtable records to save.
   */
  private async saveProcessedRecords(records: Records<any>): Promise<void> {
    const recordsToInsert = records.map(record => ({
      id: record.id,
      number: record.fields["number"],
    }));
    await this.recordsCollection.insertMany(recordsToInsert);
  }

  /**
   * Maps Airtable records to the AirtableRecord interface format.
   * @param records The Airtable records to map.
   * @returns An array of mapped AirtableRecord objects.
   */
  private mapAirtableRecords(records: Records<any>): AirtableRecord[] {
    return records.map(record => ({
      id: record.id,
      fields: record._rawJson.fields,
    }));
  }
}