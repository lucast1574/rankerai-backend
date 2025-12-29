import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'; // Add this
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy'; // Add this
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../../shared/email/email.module';
import { GoogleModule } from '../../shared/google/google.module';

@Module({
    imports: [
        UsersModule,
        EmailModule,
        GoogleModule,
        PassportModule.register({ defaultStrategy: 'auth-jwt' }), // Add this
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.getOrThrow<string>('JWT_EXPIRATION') as any,
                },
            }),
        }),
    ],
    providers: [AuthService, AuthResolver, JwtStrategy], // Add JwtStrategy here
    exports: [AuthService],
})
export class AuthModule { }