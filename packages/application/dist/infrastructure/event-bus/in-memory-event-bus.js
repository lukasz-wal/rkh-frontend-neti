var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { rehydrateEventFromDescriptor } from '@filecoin-plus/core';
import { TYPES } from '../../types.js';
import { injectable, multiInject } from 'inversify';
/**
 * InMemoryEventBus
 *
 * A simple, in-memory implementation of IEventBus for testing purposes.
 * This class allows publishing events to in-memory channels and processing
 * them with registered event handlers.
 */
let InMemoryEventBus = class InMemoryEventBus {
    eventHandlers;
    channels;
    constructor(eventHandlers) {
        this.eventHandlers = eventHandlers;
        this.channels = new Map();
    }
    /**
     * Publishes an event to a specific channel.
     *
     * @param channel - The name of the channel to publish the event to.
     * @param eventDescriptor - The event descriptor to be published.
     */
    async publish(channel, eventDescriptor) {
        if (!this.channels.has(channel)) {
            this.channels.set(channel, []);
        }
        this.channels.get(channel).push(eventDescriptor);
        // Process the event immediately
        await this.processEvent(eventDescriptor);
    }
    /**
     * Subscribes to events.
     * In this in-memory implementation, this method is a no-op as events
     * are processed immediately upon publishing.
     */
    async subscribeEvents() {
        // No-op: Events are processed immediately in publish()
    }
    /**
     * Processes a single event by invoking all matching event handlers.
     *
     * @param eventDescriptor - The event descriptor to be processed.
     */
    async processEvent(eventDescriptor) {
        const matchedHandlers = this.eventHandlers.filter((handler) => handler.event === eventDescriptor.eventName);
        await Promise.all(matchedHandlers.map((handler) => {
            return handler.handle(rehydrateEventFromDescriptor(eventDescriptor));
        }));
    }
    /**
     * Retrieves all events published to a specific channel.
     * This method is useful for testing purposes to verify published events.
     *
     * @param channel - The name of the channel to retrieve events from.
     * @returns An array of EventDescriptors published to the specified channel.
     */
    getEventsForChannel(channel) {
        return this.channels.get(channel) || [];
    }
    /**
     * Clears all published events from all channels.
     * This method is useful for resetting the state between tests.
     */
    clearAllEvents() {
        this.channels.clear();
    }
};
InMemoryEventBus = __decorate([
    injectable(),
    __param(0, multiInject(TYPES.Event)),
    __metadata("design:paramtypes", [Array])
], InMemoryEventBus);
export { InMemoryEventBus };
