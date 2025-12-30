import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';
import { WelcomeEmail } from './templates/welcome';
import { ForgotPasswordEmail } from './templates/forgot-password';

@Injectable()
export class MailService {
    constructor(private configService: ConfigService) {
        // Initialize SendGrid with the API Key
        const apiKey = this.configService.getOrThrow<string>('email.apiKey');
        sgMail.setApiKey(apiKey);
    }

    async sendWelcomeEmail(to: string, name: string) {
        const html = await render(WelcomeEmail({ name }));
        await this.sendMail(to, 'Welcome to RankerAI', html);
    }

    async sendForgotPasswordEmail(to: string, name: string, token: string) {
        const frontendUrl = this.configService.get<string>('app.frontendUrl');
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        const html = await render(ForgotPasswordEmail({ name, resetLink }));
        await this.sendMail(to, 'Reset your password', html);
    }

    private async sendMail(to: string, subject: string, html: string) {
        const msg = {
            to,
            from: this.configService.getOrThrow<string>('email.from'),
            subject,
            html,
        };

        try {
            await sgMail.send(msg);
        } catch (error) {
            // It's good practice to log email errors specifically
            console.error('SendGrid Error:', error);
            throw error;
        }
    }
}