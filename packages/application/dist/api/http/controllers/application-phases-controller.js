var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { TYPES } from "../../../types.js";
import { inject } from "inversify";
import { controller, httpPost, request, requestParam, response } from "inversify-express-utils";
import { validateRequest } from "../processors/validate.js";
import { CompletePhaseCommand, StartPhaseCommand } from "../../../application/commands/definitions/index.js";
import { DatacapAllocatorPhase } from "../../../domain/datacap-allocator.js";
let ApplicationPhasesController = class ApplicationPhasesController {
    _commandBus;
    constructor(_commandBus) {
        this._commandBus = _commandBus;
    }
    // @httpPost("/", validateRequest("createAllocation"))
    // async createAllocation(@request() req: Request, @response() res: Response) {
    //   const result = await this._commandBus.send(
    //     new CreateDatacapAllocationCommand(req.body)
    //   );
    //   return res.status(201).json(result);
    // }
    async startPhase(allocatorId, phase, res) {
        const result = await this._commandBus.send(new StartPhaseCommand(allocatorId, phase));
        return res.json(result);
    }
    async completePhase(allocatorId, phase, req, res) {
        console.log(req.body);
        const result = await this._commandBus.send(new CompletePhaseCommand(allocatorId, phase, req.body));
        return res.json(result);
    }
};
__decorate([
    httpPost("/:allocatorId/phases/:phase/start", validateRequest("startPhase")),
    __param(0, requestParam("allocatorId")),
    __param(1, requestParam("phase")),
    __param(2, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationPhasesController.prototype, "startPhase", null);
__decorate([
    httpPost("/:allocatorId/phases/:phase/complete", validateRequest("completePhase")),
    __param(0, requestParam("allocatorId")),
    __param(1, requestParam("phase")),
    __param(2, request()),
    __param(3, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApplicationPhasesController.prototype, "completePhase", null);
ApplicationPhasesController = __decorate([
    controller("/api/v1/allocators"),
    __param(0, inject(TYPES.CommandBus)),
    __metadata("design:paramtypes", [Object])
], ApplicationPhasesController);
export { ApplicationPhasesController };
