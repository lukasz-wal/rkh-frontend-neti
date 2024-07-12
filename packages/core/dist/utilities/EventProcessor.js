"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RehydratedEvent = void 0;
exports.createEventDescriptor = createEventDescriptor;
exports.rehydrateEventFromDescriptor = rehydrateEventFromDescriptor;
var class_transformer_1 = require("class-transformer");
var EventDescriptor_1 = require("../EventDescriptor");
var Event_1 = require("../Event");
var RehydratedEvent = /** @class */ (function () {
    function RehydratedEvent() {
    }
    return RehydratedEvent;
}());
exports.RehydratedEvent = RehydratedEvent;
function createEventDescriptor(event) {
    var JSONEvent = (0, class_transformer_1.instanceToPlain)(event);
    for (var _i = 0, EVENT_METADATA_1 = Event_1.EVENT_METADATA; _i < EVENT_METADATA_1.length; _i++) {
        var attribute = EVENT_METADATA_1[_i];
        delete JSONEvent[attribute];
    }
    return new EventDescriptor_1.EventDescriptor(event.aggregateId, event.aggregateName, event.eventName, JSONEvent, event.version);
}
function rehydrateEventFromDescriptor(storageEvent) {
    var event = (0, class_transformer_1.plainToInstance)(RehydratedEvent, storageEvent);
    return __assign({ aggregateId: storageEvent.aggregateGuid, aggregateName: storageEvent.aggregateName, eventName: storageEvent.eventName, version: storageEvent.version }, event.payload);
}
//# sourceMappingURL=EventProcessor.js.map