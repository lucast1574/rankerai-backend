import * as Joi from 'joi';

export const configValidationSchema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(4000),
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRATION: Joi.string().required(),
    API_PREFIX: Joi.string().default('api-v1'),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),

    // Updated Email Validation (SendGrid)
    SENDGRID_API_KEY: Joi.string().required(),
    SENDGRID_FROM: Joi.string().default('no-reply@rankerai.com'),
    SENDGRID_REPLY_TO: Joi.string().email().optional(),
    SENDGRID_GLOBAL_BCC: Joi.string().email().optional(),
    SENDGRID_SANDBOX: Joi.boolean().default(false),
    SENDGRID_DISABLE_GLOBAL_BCC: Joi.boolean().default(false),
});