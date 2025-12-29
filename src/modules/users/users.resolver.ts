import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { UserDocument } from './models/user.model';

@Resolver(() => UserEntity)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Mutation(() => UserEntity, { description: 'Update the profile of the currently logged-in user' })
    async updateMe(
        @CurrentUser() user: UserDocument,
        @Args('input') input: UpdateUserInput,
    ): Promise<UserEntity> {
        const updatedUser = await this.usersService.update(user._id.toString(), input);
        return UserMapper.toEntity(updatedUser);
    }

    @Mutation(() => UserEntity, { description: 'Admin: Create a user with full field access' })
    async createUser(@Args('input') input: CreateUserInput): Promise<UserEntity> {
        const user = await this.usersService.create(input);
        return UserMapper.toEntity(user);
    }

    @Query(() => [UserEntity], { description: 'Get all users (Admin use)' })
    async findAllUsers(): Promise<UserEntity[]> {
        const users = await this.usersService.findAll();
        return users.map(user => UserMapper.toEntity(user));
    }
}