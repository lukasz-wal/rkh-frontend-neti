import { IQuery, IQueryHandler } from "@filecoin-plus/core";
import { inject, injectable } from "inversify";
import { Db } from "mongodb";

import { DatacapAllocatorPhase } from "@src/domain/datacap-allocator";
import { TYPES } from "@src/types";

export class GetDatacapAllocatorsQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly phases: DatacapAllocatorPhase[] = [],
    public readonly search?: string
  ) {}
}

@injectable()
export class GetDatacapAllocatorsQueryHandler
  implements IQueryHandler<GetDatacapAllocatorsQuery, any>
{
  queryToHandle = GetDatacapAllocatorsQuery.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async execute(query: GetDatacapAllocatorsQuery) {
    console.log("Executing query", query);
    const { page, limit, phases, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    const orConditions: any[] = [];

    if (phases.length > 0) {
      orConditions.push({
        status: {
          phase: { $in: phases },
        },
      });
    }

    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    if (search) {
      filter.$and = [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    const totalCount = await this.db
      .collection("datacapAllocators")
      .countDocuments(filter);
    const allocators = await this.db
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
