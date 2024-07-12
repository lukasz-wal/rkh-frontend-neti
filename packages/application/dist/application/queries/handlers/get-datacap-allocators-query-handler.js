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
import { TYPES } from '../../../types.js';
import { inject, injectable } from 'inversify';
import { GetDatacapAllocatorsQuery } from '../definitions/get-datacap-allocators-query.js';
import { Db } from 'mongodb';
let GetDatacapAllocatorsQueryHandler = class GetDatacapAllocatorsQueryHandler {
    _db;
    queryToHandle = GetDatacapAllocatorsQuery.name;
    constructor(_db) {
        this._db = _db;
    }
    async execute(query) {
        const { page, limit, status } = query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        const totalCount = await this._db.collection('datacapAllocators').countDocuments(filter);
        const allocators = await this._db.collection('datacapAllocators')
            .find(filter)
            .skip(skip)
            .limit(limit)
            .toArray();
        return {
            allocators,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit
            }
        };
    }
};
GetDatacapAllocatorsQueryHandler = __decorate([
    injectable(),
    __param(0, inject(TYPES.Db)),
    __metadata("design:paramtypes", [Db])
], GetDatacapAllocatorsQueryHandler);
export { GetDatacapAllocatorsQueryHandler };
