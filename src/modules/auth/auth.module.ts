// src/modules/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UsersModule } from '../users/users.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { EmailModule } from '../../shared/email/email.module';
import { GoogleModule } from '../../shared/google/google.module';

@Module({
    imports: [
        UsersModule,
        EmailModule,
        GoogleModule,
        forwardRef(() => SubscriptionsModule), // Handles circular dependency
        PassportModule.register({ defaultStrategy: 'auth-jwt' }),
        JwtModule.register({}),
    ],
    providers: [
        AuthService,
        AuthResolver,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [AuthService],
})
export class AuthModule { }