import { ICommandBus } from "@filecoin-plus/core";
import { TYPES } from "@src/types";
import { Response, Request } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  request,
  requestParam,
  response,
} from "inversify-express-utils";
import { ok } from "../processors/response";
import {
  StartKYCCommand,
  SubmitKYCResultCommand,
} from "@src/application/commands/definitions";

@controller("/api/v1/allocators")
export class KycController {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus
  ) {}

  @httpPost("/:id/kyc")
  async startKYC(@requestParam("id") id: string, @response() res: Response) {
    const result = await this._commandBus.send(new StartKYCCommand(id));
    return res.json(ok("KYC status updated successfully", result));
  }

  @httpPost("/:id/kyc/result")
  async submitKYCResult(
    @requestParam("id") id: string,
    @request() req: Request,
    @response() res: Response
  ) {
    const { event, data } = req.body;

    const result = await this._commandBus.send(
      new SubmitKYCResultCommand(id, {
        status: event === "success" ? "approved" : "rejected",
        data: data.kyc,
      })
    );
    return res.json(ok("KYC result submitted successfully", {}));
  }
}
