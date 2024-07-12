import { MongoClient } from "mongodb";
export const createMongodbConnection = async (host, dbName, options) => {
    const client = new MongoClient(host, {
        ...options,
    });
    return client
        .connect()
        .then(() => client.db(dbName))
        .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        throw error; // Rethrow the error to be handled by the caller
    });
};
