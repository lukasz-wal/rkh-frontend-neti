"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainException = exports.ConcurrencyException = exports.NotFoundException = exports.ApplicationError = void 0;
var http_status_codes_1 = require("http-status-codes");
var ApplicationError = /** @class */ (function (_super) {
    __extends(ApplicationError, _super);
    function ApplicationError(httpCode, statusCode, message) {
        var _this = _super.call(this, message) || this;
        _this.httpCode = httpCode;
        _this.statusCode = statusCode;
        return _this;
    }
    return ApplicationError;
}(Error));
exports.ApplicationError = ApplicationError;
var NotFoundException = /** @class */ (function (_super) {
    __extends(NotFoundException, _super);
    function NotFoundException(message) {
        var _this = _super.call(this, http_status_codes_1.NOT_FOUND, '404', message || 'Entity not found') || this;
        _this.message = message;
        return _this;
    }
    return NotFoundException;
}(ApplicationError));
exports.NotFoundException = NotFoundException;
var ConcurrencyException = /** @class */ (function (_super) {
    __extends(ConcurrencyException, _super);
    function ConcurrencyException(message) {
        var _this = _super.call(this, http_status_codes_1.CONFLICT, '409', message || 'Concurrency detected') || this;
        _this.message = message;
        return _this;
    }
    return ConcurrencyException;
}(ApplicationError));
exports.ConcurrencyException = ConcurrencyException;
var DomainException = /** @class */ (function (_super) {
    __extends(DomainException, _super);
    function DomainException(message) {
        var _this = _super.call(this, http_status_codes_1.BAD_REQUEST, '5310', message || 'Domain exception detected') || this;
        _this.message = message;
        return _this;
    }
    return DomainException;
}(ApplicationError));
exports.DomainException = DomainException;
//# sourceMappingURL=Errors.js.map