import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../../shared/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    // Removed 'async' because we no longer perform asynchronous DB lookups here
    canActivate(context: ExecutionContext): boolean {
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

        const role = user.role;

        if (!role || typeof role !== 'object') {
            throw new ForbiddenException('User role not found or not properly loaded');
        }

        const hasPermission = requiredPermissions.every(permission =>
            role.slug === 'admin' || (role.permissions && role.permissions.includes(permission))
        );

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient database-defined permissions');
        }

        return true;
    }
}