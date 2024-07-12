import { MongoClientOptions, Db } from "mongodb";
export declare const createMongodbConnection: (host: string, dbName: string, options?: MongoClientOptions) => Promise<Db>;
