import { ICommandBus } from "@filecoin-plus/core";
import { TYPES } from "@src/types";
import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, httpPut, request, requestParam, response } from "inversify-express-utils";
import { validateRequest } from "../processors/validate";
import { CompletePhaseCommand, StartPhaseCommand } from "@src/application/commands/definitions";
import { DatacapAllocatorPhase } from "@src/domain/datacap-allocator";

@controller("/api/v1/allocators")
export class ApplicationPhasesController {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus
  ) {}

  // @httpPost("/", validateRequest("createAllocation"))
  // async createAllocation(@request() req: Request, @response() res: Response) {
  //   const result = await this._commandBus.send(
  //     new CreateDatacapAllocationCommand(req.body)
  //   );
  //   return res.status(201).json(result);
  // }

  @httpPost("/:allocatorId/phases/:phase/start", validateRequest("startPhase"))
  async startPhase(
    @requestParam("allocatorId") allocatorId: string,
    @requestParam("phase") phase: DatacapAllocatorPhase,
    @response() res: Response
  ) {
    const result = await this._commandBus.send(
      new StartPhaseCommand(allocatorId, phase)
    );
    return res.json(result);
  }

  @httpPost(
    "/:allocatorId/phases/:phase/complete",
    validateRequest("completePhase")
  )
  async completePhase(
    @requestParam("allocatorId") allocatorId: string,
    @requestParam("phase") phase: DatacapAllocatorPhase,
    @request() req: Request,
    @response() res: Response
  ) {
    console.log(req.body)
    const result = await this._commandBus.send(
      new CompletePhaseCommand(allocatorId, phase, req.body)
    );
    return res.json(result);
  }

  /*@httpPut("/:allocatorId/phases/kyc", validateRequest("updateKYC"))
  async updateKYC(
    @requestParam("allocationId") allocatorId: string,
    @request() req: Request,
    @response() res: Response
  ) {
    const result = await this._commandBus.send(
      new UpdateKYCCommand(allocatorId, req.body)
    );
    return res.json(result);
  }

  @httpPost(
    "/:allocatorId/phases/governance-review/reviews",
    validateRequest("submitGovernanceReview")
  )
  async submitGovernanceReview(
    @requestParam("allocatorId") allocatorId: string,
    @request() req: Request,
    @response() res: Response
  ) {
    const result = await this._commandBus.send(
      new SubmitGovernanceReviewCommand(allocatorId, req.body)
    );
    return res.json(result);
  }

  @httpPut(
    "/:allocatorId/phases/rkh-approval",
    validateRequest("updateRKHApproval")
  )
  async updateRKHApproval(
    @requestParam("allocatorId") allocatorId: string,
    @request() req: Request,
    @response() res: Response
  ) {
    const result = await this._commandBus.send(
      new UpdateRKHApprovalCommand(allocatorId, req.body)
    );
    return res.json(result);
  }

  @httpPost(
    "/:allocatorId/phases/datacap-grant",
    validateRequest("grantDatacap")
  )
  async grantDatacap(
    @requestParam("allocatorId") allocatorId: string,
    @request() req: Request,
    @response() res: Response
  ) {
    const result = await this._commandBus.send(
      new GrantDatacapCommand(allocatorId, req.body)
    );
    return res.json(result);
  }*/
}
