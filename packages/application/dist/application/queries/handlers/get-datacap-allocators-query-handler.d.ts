import { IQueryHandler } from '@filecoin-plus/core';
import { GetDatacapAllocatorsQuery } from '../definitions/get-datacap-allocators-query.js';
import { Db } from 'mongodb';
export declare class GetDatacapAllocatorsQueryHandler implements IQueryHandler<GetDatacapAllocatorsQuery, any> {
    private readonly _db;
    queryToHandle: string;
    constructor(_db: Db);
    execute(query: GetDatacapAllocatorsQuery): Promise<{
        allocators: import("mongodb").WithId<import("bson").Document>[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
}
