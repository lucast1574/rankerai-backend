import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email.module';
import { MailService } from '../mail.service';

// --- MOCK TEMPLATES (Prevent module resolution failure) ---
jest.mock('../templates/forgot-password.template', () => ({
    ForgotPasswordTemplate: jest.fn(),
}));
jest.mock('../templates/welcome.template', () => ({
    WelcomeTemplate: jest.fn(),
}));
// Also mock SendGrid as it is called in MailService constructor
jest.mock('@sendgrid/mail');

describe('EmailModule', () => {
    it('should provide MailService', async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    ignoreEnvFile: true,
                    load: [() => ({
                        SENDGRID_API_KEY: 'test_key',
                        SENDGRID_FROM: 'test@rankerai.com'
                    })],
                }),
                EmailModule,
            ],
        }).compile();

        const service = module.get<MailService>(MailService);
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(MailService);
    });
});