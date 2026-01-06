import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ProjectsService } from '../../modules/projects/projects.service';

@Injectable()
export class ProjectOwnershipGuard implements CanActivate {
    constructor(private readonly projectsService: ProjectsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        const user = req.user;

        // Extract project_id from arguments (works for createDocument or filters)
        const args = ctx.getArgs();
        const projectId = args.input?.project_id || args.filter?.project_id || args.project_id;

        if (!projectId) return true; // If no project is referenced, skip check

        try {
            // Re-uses the service logic which already checks ownership
            await this.projectsService.findOne(projectId, user.id);
            return true;
        } catch (error) {
            if (error instanceof NotFoundException) throw new NotFoundException('Target project not found');
            throw new ForbiddenException('You do not have permission to access this project');
        }
    }
}