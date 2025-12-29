import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { render } from '@react-email/render';
import * as React from 'react';
import { ForgotPasswordTemplate } from './templates/forgot-password.template';
import { WelcomeTemplate } from './templates/welcome.template';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private configService: ConfigService) {
        // Uses the API Key from your .env
        SendGrid.setApiKey(this.configService.getOrThrow<string>('SENDGRID_API_KEY'));
    }

    /**
     * Private generic sender to keep code DRY (Don't Repeat Yourself)
     */
    private async send(to: string, subject: string, template: React.ReactElement) {
        const html = await render(template);

        const mailOptions: SendGrid.MailDataRequired = {
            to,
            from: this.configService.getOrThrow<string>('SENDGRID_FROM'),
            replyTo: this.configService.get<string>('SENDGRID_REPLY_TO'),
            subject: `${subject} | Ranker AI`, // Branded subject line
            html,
        };

        try {
            await SendGrid.send(mailOptions);
            this.logger.log(`Email [${subject}] sent successfully to ${to}`);
        } catch (error) {
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Failed to send email to ${to}`, stack);
            throw error;
        }
    }

    // --- Public Methods for Different Rooms ---

    async sendForgotPasswordEmail(to: string, name: string, resetLink: string) {
        return this.send(
            to,
            'Reset your Password',
            ForgotPasswordTemplate({ name, resetLink })
        );
    }

    async sendWelcomeEmail(to: string, name: string) {
        return this.send(
            to,
            'Welcome to Ranker AI',
            WelcomeTemplate({ name })
        );
    }
}