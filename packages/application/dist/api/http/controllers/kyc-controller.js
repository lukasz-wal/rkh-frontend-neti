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
import { controller, httpPost, request, requestParam, response, } from "inversify-express-utils";
import { ok } from "../processors/response.js";
import { ApproveKYCCommand, RejectKYCCommand, StartKYCCommand, SubmitKYCResultCommand, } from "../../../application/commands/definitions/index.js";
let KycController = class KycController {
    _commandBus;
    constructor(_commandBus) {
        this._commandBus = _commandBus;
    }
    async startKYC(id, res) {
        const result = await this._commandBus.send(new StartKYCCommand(id));
        return res.json(ok("KYC status updated successfully", result));
    }
    async approveKYC(id, res) {
        const result = await this._commandBus.send(new ApproveKYCCommand(id));
        return res.json(ok("KYC status updated successfully", result));
    }
    async rejectKYC(id, res) {
        const result = await this._commandBus.send(new RejectKYCCommand(id));
        return res.json(ok("KYC status updated successfully", result));
    }
    async submitKYCResult(id, req, res) {
        console.log("submitKYCResult:", id, req.body);
        const { event, data } = req.body;
        const result = await this._commandBus.send(new SubmitKYCResultCommand(id, {
            status: event === "success" ? "approved" : "rejected",
            data: data,
        }));
        console.log("submitKYCResult result:", result);
        return res.json(ok("KYC result submitted successfully", {}));
    }
};
__decorate([
    httpPost("/:id/kyc"),
    __param(0, requestParam("id")),
    __param(1, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "startKYC", null);
__decorate([
    httpPost("/:id/kyc/approve"),
    __param(0, requestParam("id")),
    __param(1, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "approveKYC", null);
__decorate([
    httpPost("/:id/kyc/reject"),
    __param(0, requestParam("id")),
    __param(1, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "rejectKYC", null);
__decorate([
    httpPost("/:id/kyc/result"),
    __param(0, requestParam("id")),
    __param(1, request()),
    __param(2, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "submitKYCResult", null);
KycController = __decorate([
    controller("/api/v1/allocators"),
    __param(0, inject(TYPES.CommandBus)),
    __metadata("design:paramtypes", [Object])
], KycController);
export { KycController };
