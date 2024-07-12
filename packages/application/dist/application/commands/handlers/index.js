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
import { ApproveKYCCommand, CompletePhaseCommand, RejectKYCCommand, StartKYCCommand, StartPhaseCommand, SubmitKYCResultCommand, } from "../../../application/commands/definitions/index.js";
import { DatacapAllocatorPhase, } from "../../../domain/datacap-allocator.js";
import { TYPES } from "../../../types.js";
// V3
let SubmitKYCResultCommandHandler = class SubmitKYCResultCommandHandler {
    _repository;
    commandToHandle = SubmitKYCResultCommand.name;
    constructor(_repository) {
        this._repository = _repository;
    }
    async handle(command) {
        console.log("SubmitKYCResultCommandHandler", command);
        const allocator = await this._repository.getById(command.allocatorId);
        if (!allocator) {
            throw new Error(`Allocator with id ${command.allocatorId} not found`);
        }
        command.result.status === "approved"
            ? allocator.approveKYC()
            : allocator.rejectKYC();
        this._repository.save(allocator, allocator.version);
    }
};
SubmitKYCResultCommandHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.DatacapAllocatorRepository)),
    __metadata("design:paramtypes", [Object])
], SubmitKYCResultCommandHandler);
export { SubmitKYCResultCommandHandler };
// V2
let StartPhaseCommandHandler = class StartPhaseCommandHandler {
    _repository;
    commandToHandle = StartPhaseCommand.name;
    constructor(_repository) {
        this._repository = _repository;
    }
    async handle(command) {
        const allocator = await this._repository.getById(command.allocatorId);
        if (!allocator) {
            throw new Error(`Allocator with id ${command.allocatorId} not found`);
        }
        switch (command.phase) {
            // case DatacapAllocatorPhase.SUBMISSION:
            //   allocator.startSubmission();
            //   break;
            case DatacapAllocatorPhase.KYC:
                allocator.startKYC();
                break;
            case DatacapAllocatorPhase.GOVERNANCE_REVIEW:
                allocator.startGovernanceReview();
                break;
            // case DatacapAllocatorPhase.RKH_APPROVAL:
            //   allocator.startRKHApproval();
            //   break;
            //
            // case DatacapAllocatorPhase.DATA_CAP_GRANT:
            //   allocator.startDataCapGrant();
            //   break;
            default:
                throw new Error(`Unknown phase: ${command.phase}`);
        }
        this._repository.save(allocator, allocator.version);
    }
};
StartPhaseCommandHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.DatacapAllocatorRepository)),
    __metadata("design:paramtypes", [Object])
], StartPhaseCommandHandler);
export { StartPhaseCommandHandler };
let CompletePhaseCommandHandler = class CompletePhaseCommandHandler {
    _repository;
    commandToHandle = CompletePhaseCommand.name;
    constructor(_repository) {
        this._repository = _repository;
    }
    async handle(command) {
        const allocator = await this._repository.getById(command.allocatorId);
        if (!allocator) {
            throw new Error(`Allocator with id ${command.allocatorId} not found`);
        }
        switch (command.phase) {
            case DatacapAllocatorPhase.KYC:
                command.data.result === "approved"
                    ? allocator.approveKYC()
                    : allocator.rejectKYC();
                break;
            case DatacapAllocatorPhase.GOVERNANCE_REVIEW:
                command.data.result === "approved"
                    ? allocator.approveGovernanceReview()
                    : allocator.rejectGovernanceReview();
                break;
            default:
                throw new Error(`Unknown phase: ${command.phase}`);
        }
        this._repository.save(allocator, allocator.version);
    }
};
CompletePhaseCommandHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.DatacapAllocatorRepository)),
    __metadata("design:paramtypes", [Object])
], CompletePhaseCommandHandler);
export { CompletePhaseCommandHandler };
// V1
let StartKYCCommandHandler = class StartKYCCommandHandler {
    _repository;
    commandToHandle = StartKYCCommand.name;
    constructor(_repository) {
        this._repository = _repository;
    }
    async handle(command) {
        const application = await this._repository.getById(command.applicationId);
        if (!application) {
            throw new Error(`Application with id ${command.applicationId} not found`);
        }
        application.startKYC();
        this._repository.save(application, application.version);
    }
};
StartKYCCommandHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.DatacapAllocatorRepository)),
    __metadata("design:paramtypes", [Object])
], StartKYCCommandHandler);
export { StartKYCCommandHandler };
let ApproveKYCCommandHandler = class ApproveKYCCommandHandler {
    _repository;
    commandToHandle = ApproveKYCCommand.name;
    constructor(_repository) {
        this._repository = _repository;
    }
    async handle(command) {
        const application = await this._repository.getById(command.applicationId);
        if (!application) {
            throw new Error(`Application with id ${command.applicationId} not found`);
        }
        application.approveKYC();
        this._repository.save(application, application.version);
    }
};
ApproveKYCCommandHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.DatacapAllocatorRepository)),
    __metadata("design:paramtypes", [Object])
], ApproveKYCCommandHandler);
export { ApproveKYCCommandHandler };
let RejectKYCCommandHandler = class RejectKYCCommandHandler {
    _repository;
    commandToHandle = RejectKYCCommand.name;
    constructor(_repository) {
        this._repository = _repository;
    }
    async handle(command) {
        const application = await this._repository.getById(command.applicationId);
        if (!application) {
            throw new Error(`Application with id ${command.applicationId} not found`);
        }
        application.rejectKYC();
        this._repository.save(application, application.version);
    }
};
RejectKYCCommandHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.DatacapAllocatorRepository)),
    __metadata("design:paramtypes", [Object])
], RejectKYCCommandHandler);
export { RejectKYCCommandHandler };
