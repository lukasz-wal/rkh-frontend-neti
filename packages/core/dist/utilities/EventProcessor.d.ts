import { EventDescriptor } from "../EventDescriptor";
import { EVENT_METADATA_TYPES } from "../Event";
import { IEvent } from "../interfaces/IEvent";
export type StorageEvent = Omit<IEvent, EVENT_METADATA_TYPES>;
export declare class RehydratedEvent {
}
export declare function createEventDescriptor<T extends IEvent = IEvent>(event: T): EventDescriptor;
export declare function rehydrateEventFromDescriptor(storageEvent: EventDescriptor): IEvent;
//# sourceMappingURL=EventProcessor.d.ts.map