import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { GqlAuthGuard } from '../../core/guards/auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Resolver(() => ProjectEntity)
@UseGuards(GqlAuthGuard, RolesGuard)
export class ProjectsResolver {
    constructor(private readonly projectsService: ProjectsService) { }

    @Mutation(() => ProjectEntity)
    @Roles('PROJECT_CREATE')
    async createProject(
        @Args('input') input: CreateProjectInput,
        @CurrentUser() user: any,
    ) {
        return this.projectsService.create(input, user._id?.toString() || user.id);
    }

    @Query(() => [ProjectEntity], { name: 'getMyProjects' })
    @Roles('PROJECT_VIEW')
    async findAll(@CurrentUser() user: any) {
        return this.projectsService.findAll(user._id?.toString() || user.id);
    }

    @Query(() => ProjectEntity, { name: 'getProject' })
    @Roles('PROJECT_VIEW')
    async findOne(
        @Args('id', { type: () => ID }) id: string,
        @CurrentUser() user: any,
    ) {
        return this.projectsService.findOne(id, user._id?.toString() || user.id);
    }

    @Mutation(() => ProjectEntity)
    @Roles('PROJECT_UPDATE')
    async updateProject(
        @Args('input') input: UpdateProjectInput,
        @CurrentUser() user: any,
    ) {
        return this.projectsService.update(input._id, input, user._id?.toString() || user.id);
    }

    @Mutation(() => Boolean)
    @Roles('PROJECT_DELETE')
    async deleteProject(
        @Args('id', { type: () => ID }) id: string,
        @CurrentUser() user: any,
    ) {
        return this.projectsService.remove(id, user._id?.toString() || user.id);
    }
}