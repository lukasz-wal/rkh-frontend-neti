var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
let CommandBus = class CommandBus {
    handlers = new Map();
    registerHandler(handler) {
        const targetCommand = handler.commandToHandle;
        if (this.handlers.has(targetCommand)) {
            return;
        }
        this.handlers.set(targetCommand, handler);
    }
    async send(command) {
        if (this.handlers.has(command.constructor.name)) {
            return this.handlers.get(command.constructor.name).handle(command);
        }
    }
};
CommandBus = __decorate([
    injectable()
], CommandBus);
export { CommandBus };
