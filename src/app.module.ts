import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations, configValidationSchema } from './core/config'; // Updated name
import { MongoModule } from './core/database/mongo.module';
import { GraphqlModule } from './core/graphql/graphql.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: configurations,
            validationSchema: configValidationSchema, // Matches the new export name
        }),
        MongoModule,
        GraphqlModule,
        AuthModule,
        UsersModule,
        RolesModule,
        SubscriptionsModule,
    ],
})
export class AppModule { }