import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { AppModule } from './app.module';
import { SeedService } from './core/database/seed.service';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    // Inicialización de Sentry
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
    });

    const app = await NestFactory.create(AppModule);

    // 1. OBTENER CONFIGURACIÓN
    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port') || 4000;
    const environment = configService.get<string>('app.nodeEnv');
    const frontendUrl = configService.get<string>('app.frontendUrl');
    const apiPrefix = configService.get<string>('app.apiPrefix') || 'api-v1';

    // 2. EJECUCIÓN DEL SEEDING (Antes de que la app escuche peticiones)
    const seedService = app.get(SeedService);
    try {
        logger.log('Starting Database Seeding...');
        await seedService.onApplicationBootstrap();
        logger.log('✅ Database Seeding completed successfully');
    } catch (error) {
        logger.error('❌ Database Seeding failed', error);
    }

    // 3. CONFIGURACIÓN GLOBAL
    // Esto añade /api-v1/ a todas las rutas REST
    app.setGlobalPrefix(apiPrefix);

    // Configuración de CORS robusta
    app.enableCors({
        origin: environment === 'production' ? frontendUrl : true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    // Pipes de validación
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // 4. INICIAR SERVIDOR
    await app.listen(port);

    // Logs informativos
    logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
    logger.log(`📊 GraphQL Playground: http://localhost:${port}/${apiPrefix}/graphql`);
    logger.log(`🌍 Environment: ${environment}`);
}

bootstrap().catch((err) => {
    console.error('Error starting application', err);
    process.exit(1);
});