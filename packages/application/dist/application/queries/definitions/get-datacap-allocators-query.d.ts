import { IQuery } from '@filecoin-plus/core';
import { DatacapAllocatorStatus } from '../../../domain/datacap-allocator.js';
export declare class GetDatacapAllocatorsQuery implements IQuery {
    readonly page: number;
    readonly limit: number;
    readonly status?: DatacapAllocatorStatus | undefined;
    constructor(page?: number, limit?: number, status?: DatacapAllocatorStatus | undefined);
}
