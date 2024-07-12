"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var nanoid_1 = require("nanoid");
var Command = /** @class */ (function () {
    function Command(guid) {
        this.guid = guid || (0, nanoid_1.nanoid)();
    }
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map