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
import { Db } from "mongodb";
import { AllocatorApplied } from "../../../domain/events.js";
import { TYPES } from "../../../types.js";
import { CommandBus } from "../../../infrastructure/command-bus/index.js";
import { UpdateApplicationPullRequestCommand } from "../../../application/commands/definitions/update-application-pr.js";
import { DatacapAllocatorPhase, DatacapAllocatorPhaseStatus } from "../../../domain/datacap-allocator.js";
let AllocatorAppliedEventHandler = class AllocatorAppliedEventHandler {
    _commandBus;
    _db;
    event = AllocatorApplied.name;
    constructor(_commandBus, _db) {
        this._commandBus = _commandBus;
        this._db = _db;
    }
    async handle(event) {
        // Insert allocator data into the database
        const allocatorId = event.aggregateId;
        await this._db.collection("datacapAllocators").insertOne({
            id: allocatorId,
            firstName: event.firstname,
            lastName: event.lastname,
            email: event.email,
            githubId: event.githubId,
            currentPosition: event.currentPosition,
            status: {
                phase: DatacapAllocatorPhase.KYC,
                phaseStatus: DatacapAllocatorPhaseStatus.NOT_STARTED,
            }
        });
        const result = await this._commandBus.send(new UpdateApplicationPullRequestCommand(allocatorId));
        console.log(`Created PR for allocator ${allocatorId}: ${result}`);
    }
};
AllocatorAppliedEventHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.CommandBus)),
    __param(1, inject(TYPES.Db)),
    __metadata("design:paramtypes", [CommandBus,
        Db])
], AllocatorAppliedEventHandler);
export { AllocatorAppliedEventHandler };
