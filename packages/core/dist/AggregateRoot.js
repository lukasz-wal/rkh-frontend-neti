"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
var nanoid_1 = require("nanoid");
var AggregateRoot = /** @class */ (function () {
    function AggregateRoot(guid) {
        this.__version = -1;
        this.__changes = [];
        this.guid = guid || (0, nanoid_1.nanoid)();
    }
    Object.defineProperty(AggregateRoot.prototype, "version", {
        get: function () {
            return this.__version;
        },
        enumerable: false,
        configurable: true
    });
    AggregateRoot.prototype.getUncommittedEvents = function () {
        return this.__changes;
    };
    AggregateRoot.prototype.markChangesAsCommitted = function () {
        this.__changes = [];
    };
    AggregateRoot.prototype.applyChange = function (event) {
        this.applyEvent(event, true);
    };
    AggregateRoot.prototype.applyEvent = function (event, isNew) {
        if (isNew === void 0) { isNew = false; }
        this["apply".concat(event.eventName)](event);
        if (isNew)
            this.__changes.push(event);
    };
    AggregateRoot.prototype.loadFromHistory = function (events) {
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            this.applyEvent(event_1);
            this.__version++;
        }
    };
    return AggregateRoot;
}());
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=AggregateRoot.js.map