import { IQuery } from '@filecoin-plus/core';
import { DatacapAllocatorStatus } from '@src/domain/datacap-allocator';

export class GetDatacapAllocatorsQuery implements IQuery {
    constructor(
      public readonly page: number = 1,
      public readonly limit: number = 10,
      public readonly status?: DatacapAllocatorStatus
    ) {}
  }