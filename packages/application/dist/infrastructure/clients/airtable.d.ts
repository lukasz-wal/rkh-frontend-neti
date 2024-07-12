export type AirtableRecord = {
    id: string;
    fields: {
        [key: string]: any;
    };
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
export declare class AirtableClient implements IAirtableClient {
    private readonly config;
    private readonly base;
    private lastProcessedTimestamp;
    constructor(config: AirtableClientConfig);
    getTableRecords(): Promise<AirtableRecord[]>;
}
