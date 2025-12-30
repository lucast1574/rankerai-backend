import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';
import { WelcomeEmail } from './templates/welcome';
import { ForgotPasswordEmail } from './templates/forgot-password';

@Injectable()
export class MailService {
    constructor(private configService: ConfigService) {
        sgMail.setApiKey(this.configService.getOrThrow<string>('email.apiKey'));
    }

    async sendWelcomeEmail(to: string, name: string) {
        const html = await render(WelcomeEmail({ name }));
        await this.sendMail(to, 'Welcome to RankerAI', html);
    }

    // NEW: React Email implementation for Forgot Password
    async sendForgotPasswordEmail(to: string, name: string, token: string) {
        const resetLink = `${this.configService.get<string>('app.frontendUrl')}/reset-password?token=${token}`;
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
        await sgMail.send(msg);
    }
}