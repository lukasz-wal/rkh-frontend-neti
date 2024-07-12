import { IEvent } from './interfaces/IEvent';
export declare abstract class AggregateRoot {
    [x: string]: any;
    guid: string;
    private __version;
    private __changes;
    get version(): number;
    constructor(guid?: string);
    getUncommittedEvents(): IEvent[];
    markChangesAsCommitted(): void;
    protected applyChange(event: IEvent): void;
    private applyEvent;
    loadFromHistory(events: IEvent[]): void;
}
//# sourceMappingURL=AggregateRoot.d.ts.map