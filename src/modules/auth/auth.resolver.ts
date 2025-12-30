import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Public } from '../../shared/decorators/public.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserMapper } from '../users/mappers/user.mapper';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import type { UserDocument } from '../users/models/user.model';

@Resolver(() => UserEntity)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Public()
    @Mutation(() => String, { description: 'Login with email and password' })
    async login(@Args('input') input: LoginInput): Promise<string> {
        const result = await this.authService.login(input);
        return result.access_token;
    }

    @Public()
    @Mutation(() => UserEntity, { description: 'Register a new user' })
    async register(@Args('input') input: RegisterInput): Promise<UserEntity> {
        const result = await this.authService.register(input);
        return UserMapper.toEntity(result.user);
    }

    @Public()
    @Mutation(() => String, { description: 'Authenticate via Google ID Token' })
    async signInWithGoogle(@Args('idToken') idToken: string): Promise<string> {
        const result = await this.authService.googleLogin(idToken);
        return result.access_token;
    }

    // NEW: Password Recovery Mutation
    @Public()
    @Mutation(() => Boolean, { description: 'Send reset password email' })
    async forgotPassword(@Args('email') email: string): Promise<boolean> {
        return this.authService.forgotPassword(email);
    }

    // NEW: Sign Out Placeholder
    @Mutation(() => String, { description: 'Logout the current user' })
    signOut(): string {
        return 'Successful logout';
    }

    @Query(() => UserEntity, { description: 'Get current logged-in user profile' })
    me(@CurrentUser() user: UserDocument): UserEntity {
        return UserMapper.toEntity(user);
    }

    @Mutation(() => Boolean, { description: 'Permanently delete a user' })
    async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.usersService.delete(id);
    }

    @Mutation(() => UserEntity, { description: 'Deactivate a user (Soft Delete)' })
    async deactivateUser(@Args('id', { type: () => ID }) id: string): Promise<UserEntity> {
        const user = await this.usersService.deactivate(id);
        return UserMapper.toEntity(user);
    }
}