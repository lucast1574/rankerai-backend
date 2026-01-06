import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // Access configuration via the namespaced key defined in auth.config.ts
            secretOrKey: configService.getOrThrow<string>('auth.jwtSecret'),
        });
    }

    async validate(payload: { sub: string; email: string }) {
        // Find user and populate the role to allow the RolesGuard to work dynamically
        const user = await this.usersService.findByIdWithRole(payload.sub);

        if (!user || !user.active) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return user;
    }
}