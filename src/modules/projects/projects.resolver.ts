import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { GqlAuthGuard } from '../../core/guards/auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Resolver(() => ProjectEntity)
@UseGuards(GqlAuthGuard)
export class ProjectsResolver {
    constructor(private readonly projectsService: ProjectsService) { }

    @Mutation(() => ProjectEntity)
    async createProject(
        @Args('input') input: CreateProjectInput,
        @CurrentUser() user: any,
    ) {
        return this.projectsService.create(input, user.id);
    }

    @Query(() => [ProjectEntity], { name: 'getMyProjects' })
    async findAll(@CurrentUser() user: any) {
        return this.projectsService.findAll(user.id);
    }

    @Query(() => ProjectEntity, { name: 'getProject' })
    async findOne(
        @Args('id', { type: () => ID }) id: string,
        @CurrentUser() user: any,
    ) {
        return this.projectsService.findOne(id, user.id);
    }

    @Mutation(() => ProjectEntity)
    async updateProject(
        @Args('input') input: UpdateProjectInput,
        @CurrentUser() user: any,
    ) {
        return this.projectsService.update(input._id, input, user.id);
    }

    @Mutation(() => Boolean)
    async deleteProject(
        @Args('id', { type: () => ID }) id: string,
        @CurrentUser() user: any,
    ) {
        return this.projectsService.remove(id, user.id);
    }
}