import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { GoogleService } from '../../shared/google/google.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import * as argon2 from 'argon2';
import { User } from '../users/models/user.model';
import { RolesService } from '../roles/roles.service';
import { MailService } from '../../shared/email/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly googleService: GoogleService,
        private readonly rolesService: RolesService,
        private readonly mailService: MailService,
    ) { }

    public async generateTokens(user: User) {
        const userId = (user as any)._id.toString();
        const roleSlug = (user.role as any)?.slug || user.role;

        const payload = {
            userId: userId,
            email: user.email,
            role: roleSlug,
        };

        const jwtSecret = this.configService.get<string>('auth.jwtSecret');
        const jwtExpiration =
            this.configService.get<string>('auth.jwtExpiration') || '15m';
        const refreshSecret = this.configService.get<string>('auth.jwtRefreshSecret');
        const refreshExpiration =
            this.configService.get<string>('auth.jwtRefreshExpiration') || '7d';

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: jwtSecret,
                expiresIn: jwtExpiration as any,
            }),
            this.jwtService.signAsync(payload, {
                secret: refreshSecret,
                expiresIn: refreshExpiration as any,
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_token: 900,
        };
    }

    async register(input: RegisterInput) {
        const existingUser = await this.usersService.findByEmail(input.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const userRole = await this.rolesService.findBySlug('user');
        if (!userRole)
            throw new InternalServerErrorException('Default role not found');

        const hashedPassword = await argon2.hash(input.password);

        const newUser = await this.usersService.create({
            ...input,
            password: hashedPassword,
            role: (userRole as any)._id,
            provider: 'local',
            is_active: true,
        });

        const tokens = await this.generateTokens(newUser);

        try {
            if ((this.mailService as any).sendWelcomeEmail) {
                await (this.mailService as any).sendWelcomeEmail(
                    newUser.email,
                    newUser.first_name,
                );
            } else if ((this.mailService as any).sendWelcome) {
                await (this.mailService as any).sendWelcome(
                    newUser.email,
                    newUser.first_name,
                );
            }
        } catch (error) {
            console.error('Failed to send welcome email:', error);
        }

        return {
            user: newUser,
            ...tokens,
            success: true,
        };
    }

    async login(input: LoginInput) {
        const user = await this.usersService.findByEmail(input.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if ((user as any).provider !== 'local') {
            throw new UnauthorizedException(
                `Please login with ${(user as any).provider}`,
            );
        }

        const isPasswordValid = await argon2.verify(
            (user as any).password,
            input.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user);

        return {
            user,
            ...tokens,
            success: true,
        };
    }

    async googleLogin(idToken: string) {
        const safeToken = idToken || '';

        const googlePayload = await this.googleService.verifyToken(safeToken);
        if (!googlePayload) {
            throw new UnauthorizedException('Invalid Google Token');
        }

        const { email, given_name, family_name, picture } = googlePayload;

        if (!email) {
            throw new BadRequestException(
                'Google account does not have an email address',
            );
        }

        let user = await this.usersService.findByEmail(email);

        if (user) {
            if (!(user as any).avatar && picture) {
                await this.usersService.update((user as any)._id.toString(), {
                    avatar: picture,
                } as any);
            }
        } else {
            const userRole = await this.rolesService.findBySlug('user');
            if (!userRole)
                throw new InternalServerErrorException('Default role not found');

            user = await this.usersService.create({
                email,
                first_name: given_name,
                // FIX: Ensure no validation error if family_name is missing
                last_name: family_name || '',
                avatar: picture,
                role: (userRole as any)._id,
                provider: 'google',
                is_active: true,
                password: '',
            });

            try {
                if ((this.mailService as any).sendWelcomeEmail) {
                    await (this.mailService as any).sendWelcomeEmail(
                        user.email,
                        user.first_name,
                    );
                }
            } catch (e) {
                console.error(e);
            }
        }

        const tokens = await this.generateTokens(user);

        return {
            success: true,
            message: 'Google login successful',
            user,
            ...tokens,
        };
    }

    async refreshToken(token: string) {
        try {
            const refreshSecret = this.configService.get<string>(
                'auth.jwtRefreshSecret',
            );

            const payload = await this.jwtService.verifyAsync(token, {
                secret: refreshSecret || '',
            });

            const user = await this.usersService.findById(payload.userId);
            if (!user) throw new UnauthorizedException('User not found');

            const tokens = await this.generateTokens(user);

            return {
                success: true,
                user,
                ...tokens,
            };
        } catch (error) {
            console.error('Refresh token error:', error);
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async forgotPassword(email: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        if (!user) return false;

        const jwtSecret = this.configService.get<string>('auth.jwtSecret');

        const resetToken = this.jwtService.sign(
            { userId: (user as any)._id, email: user.email },
            { secret: jwtSecret, expiresIn: '15m' as any },
        );

        const resetLink = `${this.configService.get(
            'FRONTEND_URL',
        )}/reset-password?token=${resetToken}`;

        try {
            if ((this.mailService as any).sendForgotPasswordEmail) {
                await (this.mailService as any).sendForgotPasswordEmail(
                    user.email,
                    user.first_name,
                    resetLink,
                );
            } else if ((this.mailService as any).sendForgotPassword) {
                await (this.mailService as any).sendForgotPassword(
                    user.email,
                    user.first_name,
                    resetLink,
                );
            }
        } catch (e) {
            console.error(e);
        }

        return true;
    }

    async logout() {
        // Return the simple object matching LogoutResponse
        return {
            success: true,
            message: 'Logged out successfully',
        };
    }
}