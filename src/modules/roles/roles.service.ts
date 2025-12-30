import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from './models/role.model';
import { Permission, PermissionDocument } from './models/permission.model';
import { CreateRoleInput } from './dto/create-role.input';
import { CreatePermissionInput } from './dto/create-permission.input';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) { }

    /**
     * Finds a role by its unique slug.
     * Used by the RolesGuard to verify permissions.
     */
    async findBySlug(slug: string): Promise<RoleDocument> {
        const role = await this.roleModel.findOne({ slug, active: true }).exec();
        if (!role) {
            throw new NotFoundException(`Role with slug "${slug}" not found`);
        }
        return role;
    }

    /**
     * Returns all active roles.
     */
    async findAll(): Promise<RoleDocument[]> {
        return this.roleModel.find({ active: true }).exec();
    }

    /**
     * Creates a new dynamic role.
     * Includes audit fields matching the backup project structure.
     */
    async createRole(data: CreateRoleInput, adminId: string): Promise<RoleDocument> {
        const existing = await this.roleModel.findOne({ slug: data.slug });
        if (existing) {
            throw new ConflictException(`Role slug "${data.slug}" already exists`);
        }

        const role = new this.roleModel({
            ...data,
            created_by: new Types.ObjectId(adminId),
            version: 0,
            active: true,
        });
        return role.save();
    }

    /**
     * Returns all defined permissions.
     */
    async findAllPermissions(): Promise<PermissionDocument[]> {
        return this.permissionModel.find().exec();
    }

    /**
     * Creates a new granular permission.
     */
    async createPermission(data: CreatePermissionInput): Promise<PermissionDocument> {
        const existing = await this.permissionModel.findOne({ code: data.code });
        if (existing) {
            throw new ConflictException(`Permission code "${data.code}" already exists`);
        }

        const permission = new this.permissionModel({
            ...data,
        });
        return permission.save();
    }

    /**
     * Utility to check if a role has a specific permission code.
     */
    async hasPermission(roleSlug: string, permissionCode: string): Promise<boolean> {
        const role = await this.roleModel.findOne({
            slug: roleSlug,
            permissions: permissionCode,
            active: true
        }).exec();
        return !!role;
    }
}