"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWinstonLogger = createWinstonLogger;
var winston_1 = require("winston");
function createWinstonLogger(service) {
    return (0, winston_1.createLogger)({
        level: 'info',
        defaultMeta: { service: service },
        format: winston_1.format.combine(winston_1.format.simple(), winston_1.format.label({
            label: '[LOGGER]',
        }), winston_1.format.colorize({ all: true }), winston_1.format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }), winston_1.format.align(), winston_1.format.printf(function (info) { return "[".concat(info.level, "] ").concat(info.timestamp, " : ").concat(info.message); })),
        transports: [new winston_1.transports.Console()],
    });
}
//# sourceMappingURL=Logger.js.map