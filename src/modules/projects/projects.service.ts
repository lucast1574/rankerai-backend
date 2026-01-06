import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './models/project.model';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) { }

    async create(input: CreateProjectInput, ownerId: string): Promise<ProjectDocument> {
        // Generate slug from name if not provided
        const slug = input.slug || input.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // Check for slug collision
        const existing = await this.projectModel.findOne({ slug });
        if (existing) throw new ConflictException('A project with this slug already exists');

        const newProject = new this.projectModel({
            ...input,
            slug,
            owner_id: new Types.ObjectId(ownerId),
            created_by: new Types.ObjectId(ownerId),
        });

        return newProject.save();
    }

    async findAll(ownerId: string): Promise<ProjectDocument[]> {
        return this.projectModel.find({
            owner_id: new Types.ObjectId(ownerId),
            active: true
        }).sort({ created_on: -1 }).exec();
    }

    async findOne(id: string, ownerId: string): Promise<ProjectDocument> {
        const project = await this.projectModel.findById(id);

        if (!project) throw new NotFoundException('Project not found');
        if (project.owner_id.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to access this project');
        }

        return project;
    }

    async update(id: string, input: UpdateProjectInput, ownerId: string): Promise<ProjectDocument> {
        const project = await this.findOne(id, ownerId); // Reuses ownership check

        // If name changes and slug isn't provided, we don't automatically change the slug 
        // to avoid breaking existing links, unless explicitly requested.

        Object.assign(project, {
            ...input,
            updated_by: new Types.ObjectId(ownerId),
        });

        return project.save();
    }

    async remove(id: string, ownerId: string): Promise<boolean> {
        const project = await this.findOne(id, ownerId);
        // Soft delete
        project.active = false;
        await project.save();
        return true;
    }
}