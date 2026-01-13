import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { RolesService } from '../roles/roles.service';
import { MailService } from '../../shared/email/mail.service';
import { GoogleService } from '../../shared/google/google.service';
import { hashPassword, verifyPassword } from '../../shared/utils/hash.util';
import { UserDocument } from '../users/models/user.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly googleService: GoogleService,
        private readonly configService: ConfigService,
        private readonly subscriptionsService: SubscriptionsService,
        private readonly rolesService: RolesService,
    ) { }

    async register(input: any): Promise<{ message: string; user: UserDocument }> {
        const existing = await this.usersService.findByEmail(input.email);
        if (existing) throw new ConflictException('User already exists');

        const hashedPassword = await hashPassword(input.password);
        const userRole = await this.rolesService.findBySlug('user');
        if (!userRole) throw new NotFoundException('Default user role not found');

        const user = await this.usersService.create({
            ...input,
            password_hash: hashedPassword,
            auth_provider: 'CREDENTIALS',
            role: userRole._id,
        });

        const freePlan = await this.subscriptionsService.findPlanBySlug('free');
        if (freePlan) {
            await this.subscriptionsService.createInitialSubscription(
                user._id.toString(),
                freePlan._id.toString(),
            );
        }

        await this.mailService.sendWelcomeEmail(user.email, user.first_name);
        return { message: 'Registration successful', user };
    }

    async login(input: any) {
        const user = await this.usersService.findByEmail(input.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (user.auth_provider === 'GOOGLE')
            throw new BadRequestException('Use Google Login');

        if (
            !user.password_hash ||
            !(await verifyPassword(input.password, user.password_hash))
        ) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.usersService.updateLastLogin(user._id.toString());
        return this.generateTokens(user);
    }

    async forgotPassword(email: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.active) {
            const resetToken = randomBytes(32).toString('hex');
            await this.usersService.setResetToken(user._id, resetToken);
            await this.mailService.sendForgotPasswordEmail(
                user.email,
                user.first_name,
                resetToken,
            );
        }
        return true;
    }

    async refreshToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow<string>('auth.jwtRefreshSecret'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.active) throw new UnauthorizedException();
            return this.generateTokens(user);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private async generateTokens(user: UserDocument) {
        const roleSlug =
            user.role && typeof user.role === 'object'
                ? (user.role as any).slug
                : 'user';
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: roleSlug,
        };

        const accessTokenExp = this.configService.getOrThrow<string>('auth.jwtExpiration');

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>('auth.jwtSecret'),
                expiresIn: accessTokenExp as any,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>('auth.jwtRefreshSecret'),
                expiresIn: this.configService.getOrThrow<string>(
                    'auth.jwtRefreshExpiration',
                ) as any,
            }),
        ]);

        // Calculate expiration timestamp (Current time + seconds from config)
        const expires_token = Math.floor(Date.now() / 1000) + parseInt(accessTokenExp);

        return {
            success: true,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_token,
            user
        };
    }

    async googleLogin(idToken: string) {
        const googlePayload = await this.googleService.verifyToken(idToken);
        const email = googlePayload.email!;
        let user = await this.usersService.findByEmail(email);

        if (!user) {
            const userRole = await this.rolesService.findBySlug('user');
            user = await this.usersService.createFromGoogle({
                email,
                first_name: googlePayload.given_name || 'User',
                last_name: googlePayload.family_name || '',
                role: userRole?._id,
            });
            const freePlan = await this.subscriptionsService.findPlanBySlug('free');
            if (freePlan)
                await this.subscriptionsService.createInitialSubscription(
                    user._id.toString(),
                    freePlan._id.toString(),
                );
            await this.mailService.sendWelcomeEmail(user.email, user.first_name);
        }

        await this.usersService.updateLastLogin(user._id.toString());
        return this.generateTokens(user);
    }
}