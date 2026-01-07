import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from './models/role.model';
import { Permission, PermissionDocument } from './models/permission.model';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { CreatePermissionInput } from './dto/create-permission.input';

@Injectable()
export class RolesService implements OnModuleInit {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) { }

    /**
     * Seed basic roles on startup to ensure registration works.
     * Manually assigning Types.ObjectId() ensures Mongoose satisfies internal 
     * validation before the database driver handles the save.
     */
    async onModuleInit() {
        try {
            const userRole = await this.roleModel.findOne({ slug: 'user' });
            if (!userRole) {
                const newUserRole = new this.roleModel({
                    _id: new Types.ObjectId(),
                    name: 'User',
                    slug: 'user',
                    permissions: [],
                    active: true,
                    version: 1,
                });
                await newUserRole.save();
                console.log('✅ Default "user" role seeded');
            }

            const adminRole = await this.roleModel.findOne({ slug: 'admin' });
            if (!adminRole) {
                const newAdminRole = new this.roleModel({
                    _id: new Types.ObjectId(),
                    name: 'Administrator',
                    slug: 'admin',
                    permissions: ['*'],
                    active: true,
                    version: 1,
                });
                await newAdminRole.save();
                console.log('✅ Default "admin" role seeded');
            }
        } catch (error: unknown) {
            // Narrow the type to access the message safely
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('⚠️ Error seeding roles:', errorMessage);
        }
    }

    async getRoleWithPermissions(slug: string): Promise<RoleDocument | null> {
        return this.roleModel.findOne({ slug, active: true }).exec();
    }

    async findBySlug(slug: string): Promise<RoleDocument> {
        const role = await this.roleModel.findOne({ slug, active: true }).exec();
        if (!role) {
            throw new NotFoundException(`Role with slug "${slug}" not found`);
        }
        return role;
    }

    async findAll(): Promise<RoleDocument[]> {
        return this.roleModel.find({ active: true }).exec();
    }

    async createRole(data: CreateRoleInput, adminId: string): Promise<RoleDocument> {
        const existing = await this.roleModel.findOne({ slug: data.slug });
        if (existing) throw new ConflictException(`Role slug "${data.slug}" exists`);

        const role = new this.roleModel({
            ...data,
            _id: new Types.ObjectId(),
            created_by: new Types.ObjectId(adminId),
            active: true,
        });
        return role.save();
    }

    async updateRole(id: string, data: UpdateRoleInput, adminId: string): Promise<RoleDocument> {
        const role = await this.roleModel.findById(id);
        if (!role) throw new NotFoundException('Role not found');

        Object.assign(role, {
            ...data,
            updated_by: new Types.ObjectId(adminId),
        });

        return role.save();
    }

    async createPermission(data: CreatePermissionInput, adminId: string): Promise<PermissionDocument> {
        const existing = await this.permissionModel.findOne({ code: data.code });
        if (existing) throw new ConflictException(`Permission code "${data.code}" exists`);

        const permission = new this.permissionModel({
            ...data,
            _id: new Types.ObjectId(),
            created_by: new Types.ObjectId(adminId),
        });
        return permission.save();
    }

    async findAllPermissions(): Promise<PermissionDocument[]> {
        return this.permissionModel.find().exec();
    }
}