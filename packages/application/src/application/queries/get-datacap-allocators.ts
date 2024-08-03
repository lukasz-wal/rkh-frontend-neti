import { IQuery, IQueryHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";
import { Db } from "mongodb";

import { DatacapAllocatorStatus } from "@src/domain/datacap-allocator";
import { TYPES } from "@src/types";

export class GetDatacapAllocatorsQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly status?: DatacapAllocatorStatus
  ) {}
}

@injectable()
export class GetDatacapAllocatorsQueryHandler
  implements IQueryHandler<GetDatacapAllocatorsQuery, any>
{
  queryToHandle = GetDatacapAllocatorsQuery.name;

  constructor(@inject(TYPES.Db) private readonly _db: Db) {}

  async execute(query: GetDatacapAllocatorsQuery) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const totalCount = await this._db
      .collection("datacapAllocators")
      .countDocuments(filter);
    const allocators = await this._db
      .collection("datacapAllocators")
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
        itemsPerPage: limit,
      },
    };
  }
}
