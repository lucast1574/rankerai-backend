import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from '../../shared/decorators/public.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserMapper } from '../users/mappers/user.mapper';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { GoogleLoginInput } from './dto/google-login.input';
import { AuthResponse } from './dto/auth-response.object';

@Resolver(() => UserEntity)
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Mutation(() => AuthResponse, { description: 'Login with email and password' })
    async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
        const result = await this.authService.login(input);
        return {
            success: result.success,
            message: 'Login successful', // ✅ Añadido
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            expires_token: result.expires_token,
            user: UserMapper.toEntity(result.user),
        };
    }

    @Public()
    @Mutation(() => AuthResponse, {
        description: 'Get a new access token using a refresh token',
    })
    async refreshToken(@Args('token') token: string): Promise<AuthResponse> {
        const result = await this.authService.refreshToken(token);
        return {
            success: result.success,
            message: 'Token refreshed successfully', // ✅ Añadido
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            expires_token: result.expires_token,
            user: UserMapper.toEntity(result.user),
        };
    }

    @Public()
    @Mutation(() => UserEntity, { description: 'Register a new user' })
    async register(@Args('input') input: RegisterInput): Promise<UserEntity> {
        const result = await this.authService.register(input);
        return UserMapper.toEntity(result.user);
    }

    @Public()
    @Mutation(() => AuthResponse, { description: 'Authenticate via Google ID Token' })
    async loginWithGoogle(
        @Args('input') input: GoogleLoginInput,
    ): Promise<AuthResponse> {
        const result = await this.authService.googleLogin(input.idToken);
        return {
            success: result.success,
            message: 'Google login successful', // ✅ Añadido
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            expires_token: result.expires_token,
            user: UserMapper.toEntity(result.user),
        };
    }

    @Public()
    @Mutation(() => Boolean, { description: 'Send reset password email' })
    async forgotPassword(@Args('email') email: string): Promise<boolean> {
        return await this.authService.forgotPassword(email);
    }
}