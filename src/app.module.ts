import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; // Importar esto
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
import { ContactsModule } from './modules/contacts/contacts.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { LocationsModule } from './modules/locations/locations.module';

// Shared Modules
import { EmailModule } from './shared/email/email.module';
import { GoogleModule } from './shared/google/google.module';

// Seeding
import { SeedService } from 'src/core/database/seed.service';
import { Role, RoleSchema } from './modules/roles/models/role.model';
import { SubscriptionPlan, SubscriptionPlanSchema } from './modules/subscriptions/models/subscription-plan.model';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: configurations,
            validationSchema: configValidationSchema,
        }),
        MongoModule,
        GraphqlModule,

        // Necesario para que el SeedService use los modelos
        MongooseModule.forFeature([
            { name: Role.name, schema: RoleSchema },
            { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
        ]),

        EmailModule,
        GoogleModule,
        AuthModule,
        UsersModule,
        RolesModule,
        SubscriptionsModule,
        ProjectsModule,
        DocumentsModule,
        ContactsModule,
        LanguagesModule,
        LocationsModule,
    ],
    providers: [SeedService], // Registrar el servicio de semilla
})
export class AppModule { }