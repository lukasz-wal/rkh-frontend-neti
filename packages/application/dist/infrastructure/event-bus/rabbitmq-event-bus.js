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
import { rehydrateEventFromDescriptor, } from "@filecoin-plus/core";
import { TYPES } from "../../types.js";
import { classToPlain } from "class-transformer";
import { inject, injectable, multiInject } from "inversify";
import * as amqp from "amqplib";
/**
 * Implements IEventBus using RabbitMQ as the message broker.
 */
let RabbitMQEventBus = class RabbitMQEventBus {
    eventHandlers;
    config;
    connection = null;
    channel = null;
    constructor(eventHandlers, config) {
        this.eventHandlers = eventHandlers;
        this.config = config;
    }
    /**
     * Initializes the RabbitMQ connection and channel.
     * @throws Error if connection fails
     */
    async init() {
        try {
            const connUrl = this.buildConnectionUrl();
            console.log("Connecting to RabbitMQ at:", connUrl);
            this.connection = await amqp.connect(connUrl);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.config.exchangeName, this.config.exchangeType, { durable: true });
        }
        catch (error) {
            console.error("Failed to initialize RabbitMQ connection:", error);
            throw error;
        }
    }
    /**
     * Publishes an event to the specified channel.
     * @param channel - The channel (routing key) to publish the event to
     * @param eventDescriptor - The event descriptor to be published
     * @throws Error if channel is not initialized
     */
    async publish(channel, eventDescriptor) {
        if (!this.channel) {
            throw new Error("RabbitMQ channel not initialized. Call init() first.");
        }
        const payload = JSON.stringify(classToPlain(eventDescriptor));
        this.channel.publish(this.config.exchangeName, channel, Buffer.from(payload), {
            persistent: true,
            messageId: eventDescriptor.aggregateGuid,
        });
    }
    /**
     * Subscribes to events and processes them using registered event handlers.
     * @throws Error if channel is not initialized
     */
    async subscribeEvents() {
        if (!this.channel) {
            throw new Error("RabbitMQ channel not initialized. Call init() first.");
        }
        const { queue } = await this.channel.assertQueue(this.config.queueName, {
            durable: true,
        });
        await this.channel.bindQueue(queue, this.config.exchangeName, this.config.queueName);
        await this.channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    await this.processMessage(msg);
                    this.channel.ack(msg);
                }
                catch (error) {
                    console.error("Error processing message:", error);
                    // Implement your error handling strategy here (e.g., dead-letter queue)
                    this.channel.nack(msg, false, false);
                }
            }
        });
    }
    /**
     * Closes the RabbitMQ connection and channel.
     */
    async close() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
    /**
     * Processes a single message, invoking appropriate event handlers.
     * @param msg - The RabbitMQ message to process
     */
    async processMessage(msg) {
        const eventDescriptor = JSON.parse(msg.content.toString());
        const matchedHandlers = this.eventHandlers.filter((handler) => handler.event === eventDescriptor.eventName);
        await Promise.all(matchedHandlers.map((handler) => handler.handle(rehydrateEventFromDescriptor(eventDescriptor))));
    }
    buildConnectionUrl() {
        const { url, username, password } = this.config;
        if (!username || !password) {
            return `amqp://${url}`;
        }
        return `amqp://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${url}`;
    }
};
RabbitMQEventBus = __decorate([
    injectable(),
    __param(0, multiInject(TYPES.Event)),
    __param(1, inject(TYPES.RabbitMQConfig)),
    __metadata("design:paramtypes", [Array, Object])
], RabbitMQEventBus);
export { RabbitMQEventBus };
