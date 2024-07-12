import { IQuery } from './IQuery';
export interface IQueryHandler<T extends IQuery = any, R = any> {
    queryToHandle: string;
    execute(query: T): Promise<R>;
}
//# sourceMappingURL=IQueryHandler.d.ts.map