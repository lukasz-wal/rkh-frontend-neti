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
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types.js";
import { DatacapAllocatorPhaseStatus, } from "../../../domain/datacap-allocator.js";
import { SetGovernanceReviewStatusCommand } from "../definitions/set-governance-review-status.js";
let SetGovernanceReviewStatusCommandHandler = class SetGovernanceReviewStatusCommandHandler {
    _repository;
    commandToHandle = SetGovernanceReviewStatusCommand.name;
    constructor(_repository) {
        this._repository = _repository;
    }
    async handle(command) {
        const allocator = await this._repository.getById(command.allocatorId);
        if (!allocator) {
            throw new Error(`Datacap allocator with id ${command.allocatorId} not found`);
        }
        switch (command.status) {
            case DatacapAllocatorPhaseStatus.IN_PROGRESS:
                allocator.startGovernanceReview();
                break;
            case DatacapAllocatorPhaseStatus.COMPLETED:
                allocator.completeGovernanceReview();
                break;
            default:
                throw new Error(`Invalid governance review status ${command.status}`);
        }
        this._repository.save(allocator, allocator.version);
    }
};
SetGovernanceReviewStatusCommandHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.DatacapAllocatorRepository)),
    __metadata("design:paramtypes", [Object])
], SetGovernanceReviewStatusCommandHandler);
export { SetGovernanceReviewStatusCommandHandler };
