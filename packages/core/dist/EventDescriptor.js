"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDescriptor = void 0;
var EventDescriptor = /** @class */ (function () {
    function EventDescriptor(aggregateGuid, aggregateName, eventName, payload, version) {
        this.aggregateGuid = aggregateGuid;
        this.aggregateName = aggregateName;
        this.eventName = eventName;
        this.payload = payload;
        this.version = version;
    }
    return EventDescriptor;
}());
exports.EventDescriptor = EventDescriptor;
//# sourceMappingURL=EventDescriptor.js.map