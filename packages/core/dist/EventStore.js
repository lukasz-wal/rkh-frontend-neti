"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStore = void 0;
var inversify_1 = require("inversify");
var mongodb_1 = require("mongodb");
var Errors_1 = require("./Errors");
var EventProcessor_1 = require("./utilities/EventProcessor");
var EventStore = /** @class */ (function () {
    function EventStore(eventCollection, _eventBus) {
        this.eventCollection = eventCollection;
        this._eventBus = _eventBus;
    }
    EventStore.prototype.saveEvents = function (aggregateGuid, events, expectedVersion) {
        return __awaiter(this, void 0, void 0, function () {
            var operations, latestEvent, i, _i, events_1, event_1, eventDescriptor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        operations = [];
                        return [4 /*yield*/, this.getLastEventDescriptor(aggregateGuid)];
                    case 1:
                        latestEvent = _a.sent();
                        if (latestEvent && latestEvent.version !== expectedVersion && expectedVersion !== -1) {
                            throw new Errors_1.ConcurrencyException('Cannot perform the operation due to internal conflict');
                        }
                        i = expectedVersion;
                        for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                            event_1 = events_1[_i];
                            i++;
                            event_1.version = i;
                            eventDescriptor = (0, EventProcessor_1.createEventDescriptor)(event_1);
                            this._eventBus.publish(event_1.aggregateName, eventDescriptor);
                            operations.push({ insertOne: eventDescriptor });
                        }
                        return [4 /*yield*/, this.eventCollection.bulkWrite(operations)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EventStore.prototype.getEventsForAggregate = function (aggregateGuid) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventCollection.find({ aggregateGuid: aggregateGuid }).toArray()];
                    case 1:
                        events = _a.sent();
                        if (!events.length) {
                            throw new Errors_1.NotFoundException('Aggregate with the requested Guid does not exist');
                        }
                        // TODO: any: return events.map((eventDescriptor: EventDescriptor) => rehydrateEventFromDescriptor(eventDescriptor));
                        return [2 /*return*/, events.map(function (eventDescriptor) { return (0, EventProcessor_1.rehydrateEventFromDescriptor)(eventDescriptor); })];
                }
            });
        });
    };
    EventStore.prototype.getLastEventDescriptor = function (aggregateGuid) {
        return __awaiter(this, void 0, void 0, function () {
            var latestEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventCollection.find({ aggregateGuid: aggregateGuid }, { sort: { _id: -1 } }).toArray()];
                    case 1:
                        latestEvent = (_a.sent())[0];
                        return [2 /*return*/, latestEvent];
                }
            });
        });
    };
    EventStore = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.unmanaged)()),
        __param(1, (0, inversify_1.unmanaged)()),
        __metadata("design:paramtypes", [mongodb_1.Collection, Object])
    ], EventStore);
    return EventStore;
}());
exports.EventStore = EventStore;
//# sourceMappingURL=EventStore.js.map