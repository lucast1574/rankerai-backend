import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations, configValidationSchema } from './core/config';
import { MongoModule } from './core/database/mongo.module';
import { GraphqlModule } from './core/graphql/graphql.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DocumentsModule } from './modules/documents/documents.module';

// Shared Modules
import { EmailModule } from './shared/email/email.module';
import { GoogleModule } from './shared/google/google.module';

@Module({
    imports: [
        // Core Infrastructure
        ConfigModule.forRoot({
            isGlobal: true,
            load: configurations,
            validationSchema: configValidationSchema,
        }),
        MongoModule,
        GraphqlModule,

        // Shared Utilities (Email and OAuth)
        EmailModule,
        GoogleModule,

        // Application Features
        AuthModule,
        UsersModule,
        RolesModule,
        SubscriptionsModule,
        ProjectsModule,
        DocumentsModule,
    ],
})
export class AppModule { }