import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../app.config';
import databaseConfig from '../database.config';
import authConfig from '../auth.config';
import graphqlConfig from '../graphql.config';
import emailConfig from '../email.config';

describe('Configuration Files (core/config)', () => {
    let configService: ConfigService;

    beforeAll(async () => {
        // Set up mock environment variables BEFORE the module compiles
        process.env.NODE_ENV = 'test';
        process.env.API_PREFIX = 'api-test-v1';
        process.env.MONGODB_URI = 'mongodb+srv://test_user:test_pass@cluster.mongodb.net/test_db';

        // Mock SendGrid data (Generic for testing only)
        process.env.SENDGRID_API_KEY = 'SG.mock_test_key';
        process.env.SENDGRID_FROM = 'test-sender@example.com';
        process.env.SENDGRID_REPLY_TO = 'test-reply@example.com';

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [appConfig, databaseConfig, authConfig, graphqlConfig, emailConfig],
                }),
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
    });

    it('should verify the AppConfig (API_PREFIX)', () => {
        const apiPrefix = configService.get<string>('app.apiPrefix');
        expect(apiPrefix).toBe('api-test-v1');
    });

    it('should verify DatabaseConfig URI from environment', () => {
        const dbUri = configService.get<string>('database.uri');
        expect(dbUri).toContain('test_db');
        expect(dbUri).toContain('mongodb+srv://');
    });

    it('should verify SendGrid EmailConfig values', () => {
        const apiKey = configService.get<string>('email.apiKey');
        const from = configService.get<string>('email.from');
        const replyTo = configService.get<string>('email.replyTo');

        expect(apiKey).toBe('SG.mock_test_key');
        expect(from).toBe('test-sender@example.com');
        expect(replyTo).toBe('test-reply@example.com');
    });

    it('should verify AuthConfig loading', () => {
        const jwtExp = configService.get<string>('auth.jwtExpiration');
        expect(jwtExp).toBeDefined();
    });
});