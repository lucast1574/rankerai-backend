import { registerAs } from '@nestjs/config';

export default registerAs('graphql', () => ({
    path: process.env.GRAPHQL_PATH || 'graphql',
    playground: process.env.GRAPHQL_PLAYGROUND === 'true',
    debug: process.env.GRAPHQL_DEBUG === 'true',
}));