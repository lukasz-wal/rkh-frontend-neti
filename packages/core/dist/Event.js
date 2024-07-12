"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EVENT_METADATA = void 0;
exports.EVENT_METADATA = ['eventName', 'aggregateName', 'aggregateId', 'version'];
var Event = /** @class */ (function () {
    function Event(aggregateId) {
        this.aggregateId = aggregateId;
    }
    return Event;
}());
exports.Event = Event;
//# sourceMappingURL=Event.js.map