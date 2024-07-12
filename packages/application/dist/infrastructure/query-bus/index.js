var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "inversify";
let QueryBus = class QueryBus {
    handlers = new Map();
    registerHandler(handler) {
        const queryName = handler.queryToHandle;
        if (this.handlers.has(queryName)) {
            return;
        }
        this.handlers.set(queryName, handler);
    }
    async execute(query) {
        if (this.handlers.has(query.constructor.name)) {
            return this.handlers.get(query.constructor.name).execute(query);
        }
    }
};
QueryBus = __decorate([
    injectable()
], QueryBus);
export { QueryBus };
