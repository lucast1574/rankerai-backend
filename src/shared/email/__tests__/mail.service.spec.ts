import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { render } from '@react-email/render';
import { MailService } from '../mail.service';

// --- MOCK TEMPLATES (Fixes the "Cannot find module" error) ---
jest.mock('../templates/forgot-password.template', () => ({
    ForgotPasswordTemplate: jest.fn(() => ({ type: 'ForgotPasswordTemplate' })),
}));

jest.mock('../templates/welcome.template', () => ({
    WelcomeTemplate: jest.fn(() => ({ type: 'WelcomeTemplate' })),
}));

// --- MOCK LIBRARIES ---
jest.mock('@sendgrid/mail');
jest.mock('@react-email/render', () => ({
    render: jest.fn(),
}));

describe('MailService', () => {
    let service: MailService;

    const mockConfig: Record<string, string> = {
        SENDGRID_API_KEY: 'SG.test_key',
        SENDGRID_FROM: 'noreply@rankerai.com',
        SENDGRID_REPLY_TO: 'support@rankerai.com',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MailService,
                {
                    provide: ConfigService,
                    useValue: {
                        // Arrow functions prevent "this: void" ESLint errors
                        get: jest.fn((key: string) => mockConfig[key]),
                        getOrThrow: jest.fn((key: string) => {
                            const value = mockConfig[key];
                            if (!value) throw new Error(`Missing ${key}`);
                            return value;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<MailService>(MailService);

        jest.clearAllMocks();

        // Setup the mock return for render
        (render as jest.Mock).mockResolvedValue('<html>Test Content</html>');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendWelcomeEmail', () => {
        it('should call SendGrid with the correctly rendered welcome template', async () => {
            const email = 'user@example.com';
            const name = 'John Doe';

            await service.sendWelcomeEmail(email, name);

            expect(render).toHaveBeenCalled();
            expect(SendGrid.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: email,
                    from: mockConfig.SENDGRID_FROM,
                    subject: 'Welcome to Ranker AI | Ranker AI',
                    html: '<html>Test Content</html>',
                })
            );
        });
    });

    describe('sendForgotPasswordEmail', () => {
        it('should call SendGrid with the correctly rendered forgot password template', async () => {
            const email = 'user@example.com';
            const name = 'John Doe';
            const link = 'http://localhost:3000/reset';

            await service.sendForgotPasswordEmail(email, name, link);

            expect(SendGrid.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: email,
                    subject: 'Reset your Password | Ranker AI',
                }),
            );
        });
    });
});