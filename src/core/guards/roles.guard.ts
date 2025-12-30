import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../../shared/decorators/roles.decorator';
import { Role as RoleEnum } from '../../modules/roles/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const user = req.user;

        if (!user || !user.active) {
            return false;
        }

        let userRoleSlug: string | undefined;

        if (user.role && typeof user.role === 'object' && 'slug' in user.role) {
            userRoleSlug = (user.role as { slug: string }).slug;
        } else if (typeof user.role === 'string') {
            userRoleSlug = user.role;
        }

        const hasRole = requiredRoles.some((role) => userRoleSlug === role);

        if (!hasRole) {
            throw new ForbiddenException('You do not have the required permissions to access this resource');
        }

        return true;
    }
}