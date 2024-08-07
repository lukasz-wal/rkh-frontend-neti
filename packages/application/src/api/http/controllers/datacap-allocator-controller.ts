import { IQueryBus } from "@filecoin-plus/core";
import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  request,
  requestParam,
  response,
} from "inversify-express-utils";

import { badRequest, ok } from "@src/api/http/processors/response";
import { TYPES } from "@src/types";
import { query, validationResult } from "express-validator";
import { DatacapAllocatorPhase } from "@src/domain/datacap-allocator";
import { GetDatacapAllocatorsQuery } from "@src/application/queries/get-datacap-allocators";

@controller("/api/v1/allocators")
export class DatacapAllocatorController {
  constructor(@inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus) {}

  @httpGet(
    "",
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("phase").optional().isArray(),
    query("phase.*").optional().isIn(Object.values(DatacapAllocatorPhase)),
    query("search").optional().isString()
  )
  async getAllDatacapAllocators(
    @request() req: Request,
    @response() res: Response
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(badRequest("Invalid query parameters", errors.array()));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const phases = (req.query.phase as DatacapAllocatorPhase[]) || [];
    const search = req.query.search as string | undefined;

    const result = await this._queryBus.execute(
      new GetDatacapAllocatorsQuery(page, limit, phases, search)
    );

    return res.json(ok("Retrieved allocators successfully", result));
  }

  // Get a single datacap allocator
  @httpGet("/:id")
  async getDatacapAllocator(
    @requestParam("id") id: string,
    @response() res: Response
  ) {
    // const query: GetApplicationQuery = new GetApplicationQuery(req.params.id);
    // const result = await this._queryBus.execute(query);
    // return res.json(ok('Retrieved application successfully', result));
    return res.json(ok("Retrieved application " + id + "successfully", {}));
  }
}
