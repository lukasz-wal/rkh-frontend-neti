import { ICommandBus, IQueryBus } from "@filecoin-plus/core";
import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  request,
  requestParam,
  response,
} from "inversify-express-utils";

import { badRequest, ok } from "@src/api/http/processors/response";
import { TYPES } from "@src/types";
import { body, query, validationResult } from "express-validator";
import { GetDatacapAllocatorsQuery } from "@src/application/queries/definitions/get-datacap-allocators-query";
import { DatacapAllocatorPhaseStatus, DatacapAllocatorStatus } from "@src/domain/datacap-allocator";
import { SetGovernanceReviewStatusCommand } from "@src/application/commands/definitions/set-governance-review-status";
import { CreateDatacapAllocatorCommand } from "@src/application/commands/definitions/create-datacap-allocator";

@controller("/api/v1/allocators")
export class DatacapAllocatorController {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  @httpPost("")
  async createDatacapAllocator(
    @request() req: Request,
    @response() res: Response
  ) {
    const { firstName, lastName, email, githubId, currentPosition } = req.body;
    const result = await this._commandBus.send(
      new CreateDatacapAllocatorCommand({
        githubUserId: githubId
      })
    );
    return res.json(ok("Datacap allocator created successfully", result));
  }

  @httpGet(
    "",
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("status").optional().isIn(Object.values(DatacapAllocatorPhaseStatus))
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
    const status = req.query.status as DatacapAllocatorStatus | undefined;

    const query: GetDatacapAllocatorsQuery = new GetDatacapAllocatorsQuery(
      page,
      limit,
      status
    );
    const result = await this._queryBus.execute(query);
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

  @httpPost("/actions/setGovernanceReviewStatus",
    body("id").isString(),
    body("status").isString().isIn(Object.values(DatacapAllocatorPhaseStatus))
  )
  async setGovernanceReviewStatus(
    @request() req: Request,
    @response() res: Response
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(badRequest("Invalid query parameters", errors.array()));
    }

    const { id, status } = req.body;
    const result = await this._commandBus.send(
      new SetGovernanceReviewStatusCommand(id, status as DatacapAllocatorPhaseStatus)
    );

    return res.json(ok("Governance review status updated successfully", result));
  }
}
