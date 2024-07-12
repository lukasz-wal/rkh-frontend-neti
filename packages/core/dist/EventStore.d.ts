import { Collection } from 'mongodb';
import { IEvent } from './interfaces/IEvent';
import { IEventBus } from './interfaces/IEventBus';
import { IEventStore } from './interfaces/IEventStore';
export declare abstract class EventStore implements IEventStore {
    private readonly eventCollection;
    private readonly _eventBus;
    constructor(eventCollection: Collection, _eventBus: IEventBus);
    saveEvents(aggregateGuid: string, events: IEvent[], expectedVersion: number): Promise<void>;
    getEventsForAggregate(aggregateGuid: string): Promise<IEvent[]>;
    private getLastEventDescriptor;
}
//# sourceMappingURL=EventStore.d.ts.map