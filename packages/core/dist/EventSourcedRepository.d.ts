import { AggregateRoot } from './AggregateRoot';
import { IEventStore } from './interfaces/IEventStore';
import { IRepository } from './interfaces/IRepository';
export declare class EventSourcedRepository<T extends AggregateRoot> implements IRepository<T> {
    private readonly eventStore;
    private readonly Type;
    constructor(eventStore: IEventStore, Type: {
        new (): T;
    });
    save(aggregateRoot: T, expectedVersion: number): Promise<void>;
    getById(guid: string): Promise<T>;
}
//# sourceMappingURL=EventSourcedRepository.d.ts.map