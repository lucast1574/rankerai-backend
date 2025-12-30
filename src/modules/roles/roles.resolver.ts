import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { CreatePermissionInput } from './dto/create-permission.input'; // Now used
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role as RoleEnum } from './enums/role.enum';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Resolver()
@Roles(RoleEnum.ADMIN)
export class RolesResolver {
    constructor(private readonly rolesService: RolesService) { }

    @Query(() => [RoleEntity], { name: 'roles' })
    async getRoles() {
        return this.rolesService.findAll();
    }

    @Mutation(() => RoleEntity)
    async createRole(
        @Args('input') input: CreateRoleInput,
        @CurrentUser() admin: any,
    ) {
        return this.rolesService.createRole(input, admin._id.toString());
    }

    @Query(() => [PermissionEntity], { name: 'permissions' })
    async getPermissions() {
        return await this.rolesService.findAllPermissions();
    }

    @Mutation(() => PermissionEntity)
    async createPermission(
        @Args('input') input: CreatePermissionInput,
    ) {
        return await this.rolesService.createPermission(input);
    }
}