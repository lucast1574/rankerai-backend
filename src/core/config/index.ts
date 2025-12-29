import appConfig from './app.config';
import databaseConfig from './database.config';
import authConfig from './auth.config';
import graphqlConfig from './graphql.config';
import emailConfig from './email.config';

export const configurations = [
    appConfig,
    databaseConfig,
    authConfig,
    graphqlConfig,
    emailConfig,
];

export * from './config.schema';