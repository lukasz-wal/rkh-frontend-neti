import { EventDescriptor, IEvent, IEventBus, IEventHandler } from "@filecoin-plus/core";
/**
 * Configuration options for RabbitMQEventBus
 */
export interface RabbitMQConfig {
    url: string;
    username?: string;
    password?: string;
    exchangeName: string;
    exchangeType: string;
    queueName: string;
}
/**
 * Implements IEventBus using RabbitMQ as the message broker.
 */
export declare class RabbitMQEventBus implements IEventBus {
    private readonly eventHandlers;
    private readonly config;
    private connection;
    private channel;
    constructor(eventHandlers: IEventHandler<IEvent>[], config: RabbitMQConfig);
    /**
     * Initializes the RabbitMQ connection and channel.
     * @throws Error if connection fails
     */
    init(): Promise<void>;
    /**
     * Publishes an event to the specified channel.
     * @param channel - The channel (routing key) to publish the event to
     * @param eventDescriptor - The event descriptor to be published
     * @throws Error if channel is not initialized
     */
    publish(channel: string, eventDescriptor: EventDescriptor): Promise<void>;
    /**
     * Subscribes to events and processes them using registered event handlers.
     * @throws Error if channel is not initialized
     */
    subscribeEvents(): Promise<void>;
    /**
     * Closes the RabbitMQ connection and channel.
     */
    close(): Promise<void>;
    /**
     * Processes a single message, invoking appropriate event handlers.
     * @param msg - The RabbitMQ message to process
     */
    private processMessage;
    private buildConnectionUrl;
}
