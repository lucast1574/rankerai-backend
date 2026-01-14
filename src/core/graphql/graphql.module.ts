import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                // Only fetch what is actually used
                const gqlConfig = configService.getOrThrow('graphql');

                return {
                    path: gqlConfig.path,
                    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                    sortSchema: true,
                    playground: gqlConfig.playground,
                    debug: gqlConfig.debug,
                    context: ({ req, res }) => ({ req, res }),
                    // This forces GraphQL to use the global prefix (e.g., 'api-v1') set in main.ts
                    useGlobalPrefix: true,
                };
            },
        }),
    ],
})
export class GraphqlModule { }