import { ICommandBus } from "@filecoin-plus/core";
import { Response, Request } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  request,
  requestParam,
  response,
} from "inversify-express-utils";

import { SubmitKYCResultCommand } from "@src/application/commands";
import { TYPES } from "@src/types";

import { ok } from "../processors/response";

@controller("/api/v1/allocators")
export class KycController {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus
  ) {}

  @httpPost("/kyc/result")
  async submitKYCResult(
    @requestParam("id") id: string,
    @request() req: Request,
    @response() res: Response
  ) {
    const { event, data, custom } = req.body;
    const applicationId = custom.applicationId;
    console.log("applicationId", applicationId);

    const result = await this._commandBus.send(
      new SubmitKYCResultCommand(applicationId, {
        status: event === "success" ? "approved" : "rejected",
        data: data.kyc,
      })
    );
    return res.json(ok("KYC result submitted successfully", {}));
  }
}
