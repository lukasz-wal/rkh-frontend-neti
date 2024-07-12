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
import { CreateDatacapAllocatorCommand } from "../definitions/create-datacap-allocator.js";
import { DatacapAllocator, } from "../../../domain/datacap-allocator.js";
import { TYPES } from "../../../types.js";
let CreateDatacapAllocatorCommandHandler = class CreateDatacapAllocatorCommandHandler {
    _repository;
    commandToHandle = CreateDatacapAllocatorCommand.name;
    constructor(_repository) {
        this._repository = _repository;
    }
    async handle(command) {
        const allocator = new DatacapAllocator(command.guid, command.githubUserId, command.githubUserId, command.githubUserId, command.githubUserId, command.githubUserId);
        this._repository.save(allocator, -1);
        return { guid: command.guid };
    }
};
CreateDatacapAllocatorCommandHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.DatacapAllocatorRepository)),
    __metadata("design:paramtypes", [Object])
], CreateDatacapAllocatorCommandHandler);
export { CreateDatacapAllocatorCommandHandler };
