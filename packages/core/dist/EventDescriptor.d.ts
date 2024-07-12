import { StorageEvent } from "./utilities/EventProcessor";
export declare class EventDescriptor {
    readonly aggregateGuid: string;
    readonly aggregateName: string;
    readonly eventName: string;
    readonly payload: StorageEvent;
    readonly version: number;
    constructor(aggregateGuid: string, aggregateName: string, eventName: string, payload: StorageEvent, version: number);
}
//# sourceMappingURL=EventDescriptor.d.ts.map