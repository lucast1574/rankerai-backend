import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import appConfig from '../app.config';
import databaseConfig from '../database.config';
import authConfig from '../auth.config';
import emailConfig from '../email.config';

describe('Configuration Integration (Real .env File)', () => {
    let configService: ConfigService;

    beforeAll(async () => {
        const envPath = join(process.cwd(), '.env.test');

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: envPath,
                    load: [appConfig, databaseConfig, authConfig, emailConfig],
                }),
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
    });

    it('should fetch MONGODB_URI from the .env.test file', () => {
        const dbUri = configService.get<string>('database.uri');
        // Ensure it's reading the Atlas string from your .env.test
        expect(dbUri).toContain('cluster0.cblx2dn.mongodb.net');
    });

    it('should fetch SENDGRID settings from the .env.test file', () => {
        const apiKey = configService.get<string>('email.apiKey');
        const from = configService.get<string>('email.from');

        expect(apiKey).toBeDefined();
        expect(apiKey).toContain('SG.'); // Verify it's a SendGrid key format
        expect(from).toBeDefined();
        expect(from).toContain('@'); // Verify it's an email format
    });

    it('should fetch JWT_SECRET from the .env.test file', () => {
        const secret = configService.get<string>('auth.jwtSecret');
        expect(secret).toBeDefined();
    });
});