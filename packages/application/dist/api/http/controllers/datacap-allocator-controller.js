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
import { inject } from "inversify";
import { controller, httpGet, httpPost, request, requestParam, response, } from "inversify-express-utils";
import { badRequest, ok } from "../../../api/http/processors/response.js";
import { TYPES } from "../../../types.js";
import { body, query, validationResult } from "express-validator";
import { GetDatacapAllocatorsQuery } from "../../../application/queries/definitions/get-datacap-allocators-query.js";
import { DatacapAllocatorPhaseStatus } from "../../../domain/datacap-allocator.js";
import { SetGovernanceReviewStatusCommand } from "../../../application/commands/definitions/set-governance-review-status.js";
import { CreateDatacapAllocatorCommand } from "../../../application/commands/definitions/create-datacap-allocator.js";
let DatacapAllocatorController = class DatacapAllocatorController {
    _commandBus;
    _queryBus;
    constructor(_commandBus, _queryBus) {
        this._commandBus = _commandBus;
        this._queryBus = _queryBus;
    }
    async createDatacapAllocator(req, res) {
        const { firstName, lastName, email, githubId, currentPosition } = req.body;
        const result = await this._commandBus.send(new CreateDatacapAllocatorCommand({
            githubUserId: githubId
        }));
        return res.json(ok("Datacap allocator created successfully", result));
    }
    async getAllDatacapAllocators(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(badRequest("Invalid query parameters", errors.array()));
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
        const query = new GetDatacapAllocatorsQuery(page, limit, status);
        const result = await this._queryBus.execute(query);
        return res.json(ok("Retrieved allocators successfully", result));
    }
    // Get a single datacap allocator
    async getDatacapAllocator(id, res) {
        // const query: GetApplicationQuery = new GetApplicationQuery(req.params.id);
        // const result = await this._queryBus.execute(query);
        // return res.json(ok('Retrieved application successfully', result));
        return res.json(ok("Retrieved application " + id + "successfully", {}));
    }
    async setGovernanceReviewStatus(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(badRequest("Invalid query parameters", errors.array()));
        }
        const { id, status } = req.body;
        const result = await this._commandBus.send(new SetGovernanceReviewStatusCommand(id, status));
        return res.json(ok("Governance review status updated successfully", result));
    }
};
__decorate([
    httpPost(""),
    __param(0, request()),
    __param(1, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DatacapAllocatorController.prototype, "createDatacapAllocator", null);
__decorate([
    httpGet("", query("page").optional().isInt({ min: 1 }), query("limit").optional().isInt({ min: 1, max: 100 }), query("status").optional().isIn(Object.values(DatacapAllocatorPhaseStatus))),
    __param(0, request()),
    __param(1, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DatacapAllocatorController.prototype, "getAllDatacapAllocators", null);
__decorate([
    httpGet("/:id"),
    __param(0, requestParam("id")),
    __param(1, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatacapAllocatorController.prototype, "getDatacapAllocator", null);
__decorate([
    httpPost("/actions/setGovernanceReviewStatus", body("id").isString(), body("status").isString().isIn(Object.values(DatacapAllocatorPhaseStatus))),
    __param(0, request()),
    __param(1, response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DatacapAllocatorController.prototype, "setGovernanceReviewStatus", null);
DatacapAllocatorController = __decorate([
    controller("/api/v1/allocators"),
    __param(0, inject(TYPES.CommandBus)),
    __param(1, inject(TYPES.QueryBus)),
    __metadata("design:paramtypes", [Object, Object])
], DatacapAllocatorController);
export { DatacapAllocatorController };
