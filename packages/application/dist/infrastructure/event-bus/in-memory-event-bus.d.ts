import { EventDescriptor, IEvent, IEventBus, IEventHandler } from '@filecoin-plus/core';
/**
 * InMemoryEventBus
 *
 * A simple, in-memory implementation of IEventBus for testing purposes.
 * This class allows publishing events to in-memory channels and processing
 * them with registered event handlers.
 */
export declare class InMemoryEventBus implements IEventBus {
    private readonly eventHandlers;
    private channels;
    constructor(eventHandlers: IEventHandler<IEvent>[]);
    /**
     * Publishes an event to a specific channel.
     *
     * @param channel - The name of the channel to publish the event to.
     * @param eventDescriptor - The event descriptor to be published.
     */
    publish(channel: string, eventDescriptor: EventDescriptor): Promise<void>;
    /**
     * Subscribes to events.
     * In this in-memory implementation, this method is a no-op as events
     * are processed immediately upon publishing.
     */
    subscribeEvents(): Promise<void>;
    /**
     * Processes a single event by invoking all matching event handlers.
     *
     * @param eventDescriptor - The event descriptor to be processed.
     */
    private processEvent;
    /**
     * Retrieves all events published to a specific channel.
     * This method is useful for testing purposes to verify published events.
     *
     * @param channel - The name of the channel to retrieve events from.
     * @returns An array of EventDescriptors published to the specified channel.
     */
    getEventsForChannel(channel: string): EventDescriptor[];
    /**
     * Clears all published events from all channels.
     * This method is useful for resetting the state between tests.
     */
    clearAllEvents(): void;
}
