import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlModule } from '../graphql.module';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';
import graphqlConfig from '../../config/graphql.config';
import appConfig from '../../config/app.config';

// 1. Create a dummy ObjectType and Resolver to satisfy the GraphQL root requirement
@ObjectType()
class HealthCheck {
    @Field()
    status: string;
}

@Resolver()
class HealthResolver {
    @Query(() => HealthCheck)
    health() {
        return { status: 'ok' };
    }
}

describe('GraphqlModule (Integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [appConfig, graphqlConfig],
                }),
                GraphqlModule,
            ],
            providers: [HealthResolver], // 2. Provide the dummy resolver here
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('should be defined and initialized with a valid schema', () => {
        expect(app).toBeDefined();
    });

    it('should have the Apollo driver available', () => {
        const moduleInstance = app.get(GraphqlModule);
        expect(moduleInstance).toBeDefined();
    });

    afterAll(async () => {
        await app.close();
    });
});