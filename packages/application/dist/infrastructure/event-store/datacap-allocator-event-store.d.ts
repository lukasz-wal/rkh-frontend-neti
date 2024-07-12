import { IEventBus, IEventStore, EventStore } from '@filecoin-plus/core';
import { Db } from 'mongodb';
import { DatacapAllocator } from '../../domain/datacap-allocator.js';
export declare class DatacapAllocatorEventStore extends EventStore implements IEventStore<DatacapAllocator> {
    private readonly db;
    private readonly eventBus;
    constructor(db: Db, eventBus: IEventBus);
}
