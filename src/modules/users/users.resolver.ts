import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import type { UserDocument } from './models/user.model';

@Resolver(() => UserEntity)
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

    @Roles(Role.ADMIN)
    @Query(() => [UserEntity])
    async findAllUsers(): Promise<UserEntity[]> {
        const users = await this.usersService.findAll();
        return users.map(user => UserMapper.toEntity(user));
    }
}