var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import Airtable from "airtable";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types.js";
let AirtableClient = class AirtableClient {
    config;
    base;
    lastProcessedTimestamp = null;
    constructor(config) {
        this.config = config;
        this.base = new Airtable({ apiKey: config.apiKey }).base(config.baseId);
    }
    async getTableRecords() {
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
                this.lastProcessedTimestamp = record.fields["Create Time"];
                console.log("Last processed timestamp:", this.lastProcessedTimestamp);
            }
            return records.map((record) => ({
                // TODO: Any type
                id: record.id,
                fields: record._rawJson.fields,
            }));
        }
        catch (error) {
            console.error("Error fetching records from Airtable:", error);
            return [];
        }
    }
};
AirtableClient = __decorate([
    injectable(),
    __param(0, inject(TYPES.AirtableClientConfig)),
    __metadata("design:paramtypes", [Object])
], AirtableClient);
export { AirtableClient };
