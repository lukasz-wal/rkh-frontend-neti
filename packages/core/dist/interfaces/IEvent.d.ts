import { IMessage } from './IMessage';
export interface IEvent extends IMessage {
    eventName: string;
    aggregateName: string;
    aggregateId: string;
    version?: number;
}
//# sourceMappingURL=IEvent.d.ts.map