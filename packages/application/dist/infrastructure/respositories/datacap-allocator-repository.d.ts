import { EventSourcedRepository } from '@filecoin-plus/core';
import { DatacapAllocator, IDatacapAllocatorEventStore, IDatacapAllocatorRepository } from '../../domain/datacap-allocator.js';
export declare class DatacapAllocatorRepository extends EventSourcedRepository<DatacapAllocator> implements IDatacapAllocatorRepository {
    private readonly eventstore;
    constructor(eventstore: IDatacapAllocatorEventStore);
}
