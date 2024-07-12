import { IQuery, IQueryBus, IQueryHandler } from "@filecoin-plus/core";
export declare class QueryBus<BaseQuery extends IQuery = IQuery> implements IQueryBus<BaseQuery> {
    handlers: Map<string, IQueryHandler<BaseQuery>>;
    registerHandler(handler: IQueryHandler<BaseQuery>): void;
    execute<T extends BaseQuery = BaseQuery, R = any>(query: T): Promise<any>;
}
