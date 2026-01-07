import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { GqlAuthGuard } from '../../core/guards/auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import type { UserDocument } from './models/user.model';

@Resolver(() => UserEntity)
@UseGuards(GqlAuthGuard, RolesGuard)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Mutation(() => UserEntity)
    async updateMe(
        @CurrentUser() user: UserDocument,
        @Args('input') input: UpdateUserInput,
    ): Promise<UserEntity> {
        const updatedUser = await this.usersService.update(user._id.toString(), input);
        return UserMapper.toEntity(updatedUser);
    }

    @Roles('admin')
    @Query(() => [UserEntity])
    async findAllUsers(): Promise<UserEntity[]> {
        const users = await this.usersService.findAll();
        return users.map(user => UserMapper.toEntity(user));
    }

    @Query(() => UserEntity, { name: 'me' })
    getMe(@CurrentUser() user: UserDocument): UserEntity {
        return UserMapper.toEntity(user);
    }
}