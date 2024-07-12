import { IEvent } from './interfaces/IEvent';
export type EVENT_METADATA_TYPES = 'eventName' | 'aggregateName' | 'aggregateId' | 'version';
export declare const EVENT_METADATA: string[];
export declare abstract class Event implements IEvent {
    abstract eventName: string;
    abstract aggregateName: string;
    aggregateId: string;
    version: number;
    constructor(aggregateId: string);
}
//# sourceMappingURL=Event.d.ts.map