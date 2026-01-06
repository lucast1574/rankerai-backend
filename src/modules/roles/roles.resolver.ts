import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { CreatePermissionInput } from './dto/create-permission.input';
import { Roles } from '../../shared/decorators/roles.decorator';
import { GqlAuthGuard } from '../../core/guards/auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard)
export class RolesResolver {
    constructor(private readonly rolesService: RolesService) { }

    @Query(() => [RoleEntity], { name: 'roles' })
    @Roles('admin')
    async getRoles() {
        return this.rolesService.findAll();
    }

    @Mutation(() => RoleEntity)
    @Roles('admin')
    async createRole(
        @Args('input') input: CreateRoleInput,
        @CurrentUser() admin: any,
    ) {
        return this.rolesService.createRole(input, admin.id || admin._id);
    }

    @Mutation(() => RoleEntity)
    @Roles('admin')
    async updateRole(
        @Args('input') input: UpdateRoleInput,
        @CurrentUser() admin: any,
    ) {
        return this.rolesService.updateRole(input._id, input, admin.id || admin._id);
    }

    @Query(() => [PermissionEntity], { name: 'permissions' })
    @Roles('admin')
    async getPermissions() {
        return this.rolesService.findAllPermissions();
    }

    @Mutation(() => PermissionEntity)
    @Roles('admin')
    async createPermission(
        @Args('input') input: CreatePermissionInput,
        @CurrentUser() admin: any
    ) {
        return this.rolesService.createPermission(input, admin.id || admin._id);
    }
}