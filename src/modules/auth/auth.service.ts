import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
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
    ) { }

    async register(input: any): Promise<{ message: string; user: UserDocument }> {
        const existing = await this.usersService.findByEmail(input.email);
        if (existing) throw new ConflictException('User already exists');

        const hashedPassword = await hashPassword(input.password);
        // Ensure auth_provider is set to 'CREDENTIALS' for email signups
        const user = await this.usersService.create({
            ...input,
            password_hash: hashedPassword,
            auth_provider: 'CREDENTIALS'
        });

        await this.mailService.sendWelcomeEmail(user.email, user.first_name);

        return { message: 'Registration successful', user };
    }

    async login(input: any) {
        const user = await this.usersService.findByEmail(input.email);

        if (!user) throw new UnauthorizedException('Invalid credentials');

        // PROTECTION: Prevent password login for Google-registered accounts
        if (user.auth_provider === 'GOOGLE') {
            throw new BadRequestException('Your account is registered with Google');
        }

        if (!user.password_hash || !(await verifyPassword(input.password, user.password_hash))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user._id, email: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user,
        };
    }

    // NEW: Forgot Password Logic from old project
    async forgotPassword(email: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');

        const token = await this.jwtService.signAsync(
            { sub: user._id, email: user.email },
            { expiresIn: '1h' }
        );

        await this.mailService.sendForgotPasswordEmail(user.email, user.first_name, token);
        return true;
    }

    async googleLogin(idToken: string) {
        const googlePayload = await this.googleService.verifyToken(idToken);
        const email = googlePayload.email!;

        let user = await this.usersService.findByEmail(email);

        if (!user) {
            user = await this.usersService.createFromGoogle({
                email: email,
                first_name: googlePayload.given_name || 'User',
                last_name: googlePayload.family_name || '',
            });
            await this.mailService.sendWelcomeEmail(user.email, user.first_name);
        }

        const payload = { sub: user._id, email: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user,
        };
    }
}