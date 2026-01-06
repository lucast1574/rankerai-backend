import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
    });

    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port') || 3000;
    const environment = configService.get<string>('app.env');
    const frontendUrl = configService.get<string>('app.frontendUrl');

    app.enableCors({
        origin: environment === 'production' ? frontendUrl : true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    await app.listen(port);

    logger.log(`🚀 Server is running on: http://localhost:${port}/graphql`);
    logger.log(`🌍 Environment: ${environment}`);
}

bootstrap().catch((err) => {
    console.error('Error starting application', err);
    process.exit(1);
});