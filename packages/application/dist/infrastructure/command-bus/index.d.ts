import { ICommand, ICommandBus, ICommandHandler } from '@filecoin-plus/core';
export declare class CommandBus<BaseCommand extends ICommand = ICommand> implements ICommandBus<BaseCommand> {
    handlers: Map<string, ICommandHandler<BaseCommand>>;
    registerHandler(handler: ICommandHandler<BaseCommand>): void;
    send<T extends BaseCommand>(command: T): Promise<any>;
}
