import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../../shared/decorators/roles.decorator';
import { RolesService } from '../../modules/roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private rolesService: RolesService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Now decorator values are strings (e.g., @Roles('admin') or @Roles('PROJECT_CREATE'))
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        const user = req.user;

        if (!user || !user.active) {
            return false;
        }

        // Identify user role slug from the request (populated by JwtStrategy)
        const userRoleSlug = typeof user.role === 'object' ? user.role.slug : user.role;

        if (!userRoleSlug) return false;

        // Fetch dynamic permissions from the Database
        const dbRole = await this.rolesService.getRoleWithPermissions(userRoleSlug);

        if (!dbRole) {
            throw new ForbiddenException('User role not found in database');
        }

        // Logic: Return true if user is 'admin' OR has ALL required permissions
        const hasPermission = requiredPermissions.every(permission =>
            dbRole.slug === 'admin' || dbRole.permissions.includes(permission)
        );

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient database-defined permissions');
        }

        return true;
    }
}