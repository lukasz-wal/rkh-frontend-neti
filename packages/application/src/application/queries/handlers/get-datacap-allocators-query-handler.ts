import { IQueryHandler } from '@filecoin-plus/core';
import { TYPES } from '@src/types';
import { inject, injectable } from 'inversify';

import { GetDatacapAllocatorsQuery } from '../definitions/get-datacap-allocators-query';
import { Db } from 'mongodb';

@injectable()
export class GetDatacapAllocatorsQueryHandler implements IQueryHandler<GetDatacapAllocatorsQuery, any> {
  queryToHandle = GetDatacapAllocatorsQuery.name;

  constructor(@inject(TYPES.Db) private readonly _db: Db) {}

  async execute(query: GetDatacapAllocatorsQuery) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const totalCount = await this._db.collection('datacapAllocators').countDocuments(filter);
    const allocators = await this._db.collection('datacapAllocators')
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      allocators,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    };
  }
}
