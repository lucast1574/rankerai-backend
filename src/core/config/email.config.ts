import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_FROM,
    replyTo: process.env.SENDGRID_REPLY_TO,
    globalBcc: process.env.SENDGRID_GLOBAL_BCC,
    sandbox: process.env.SENDGRID_SANDBOX === 'true',
    disableGlobalBcc: process.env.SENDGRID_DISABLE_GLOBAL_BCC === 'true',
}));