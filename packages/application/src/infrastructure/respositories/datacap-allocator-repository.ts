import { EventSourcedRepository } from '@filecoin-plus/core';
import { inject, injectable } from 'inversify';

import { TYPES } from '@src/types';

import { DatacapAllocator, IDatacapAllocatorEventStore, IDatacapAllocatorRepository } from '@src/domain/datacap-allocator';

@injectable()
export class DatacapAllocatorRepository extends EventSourcedRepository<DatacapAllocator> implements IDatacapAllocatorRepository {
  constructor(@inject(TYPES.DatacapAllocatorEventStore) private readonly eventstore: IDatacapAllocatorEventStore) {
    super(eventstore, DatacapAllocator);
  }
}