import dotenv from 'dotenv';
dotenv.config();
export default {
    API_PORT: process.env.API_PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'filecoin-plus',
    // RabbitMQ configuration
    RABBITMQ_URL: process.env.RABBITMQ_URL || 'localhost:5672',
    RABBITMQ_USERNAME: process.env.RABBITMQ_USERNAME || 'guest',
    RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD || 'guest',
    RABBITMQ_EXCHANGE_NAME: process.env.RABBITMQ_EXCHANGE_NAME || 'filecoin-plus',
    RABBITMQ_EXCHANGE_TYPE: process.env.RABBITMQ_EXCHANGE_TYPE || 'topic',
    RABBITMQ_QUEUE_NAME: process.env.RABBITMQ_QUEUE_NAME || 'filecoin-plus',
    // GitHub client configuration
    GITHUB_AUTH_TOKEN: process.env.GITHUB_AUTH_TOKEN || 'your-github-auth-token',
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY || 'patLwYgonCXqejP5C.59764734cd5d93b20d5ef64f0eb73eb8d159df45efa1580deae520bb26ef2847',
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || 'app99ksFs7kqCrBZ2',
    AIRTABLE_TABLE_NAME: process.env.AIRTABLE_TABLE_NAME || 'tblAGAD0kgWxy5kwq'
};
