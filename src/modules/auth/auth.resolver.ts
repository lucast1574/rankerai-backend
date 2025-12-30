import { Resolver, Mutation, Args } from '@nestjs/graphql'; // Removed Query
import { AuthService } from './auth.service';
import { Public } from '../../shared/decorators/public.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserMapper } from '../users/mappers/user.mapper';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.object';

@Resolver(() => UserEntity)
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Mutation(() => AuthResponse, { description: 'Login with email and password' })
    async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
        const result = await this.authService.login(input);
        return {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            user: UserMapper.toEntity(result.user)
        };
    }

    @Public()
    @Mutation(() => AuthResponse, { description: 'Get a new access token using a refresh token' })
    async refreshToken(@Args('token') token: string): Promise<AuthResponse> {
        const result = await this.authService.refreshToken(token);
        return {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            user: UserMapper.toEntity(result.user)
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
    async signInWithGoogle(@Args('idToken') idToken: string): Promise<AuthResponse> {
        const result = await this.authService.googleLogin(idToken);
        return {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            user: UserMapper.toEntity(result.user)
        };
    }

    @Public()
    @Mutation(() => Boolean, { description: 'Send reset password email' })
    async forgotPassword(@Args('email') email: string): Promise<boolean> {
        return this.authService.forgotPassword(email);
    }
}