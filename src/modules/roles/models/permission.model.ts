import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'app_permissions', timestamps: true })
export class Permission {
    @Prop({ required: true, unique: true, trim: true })
    name!: string; // e.g., "Create Project"

    @Prop({ required: true, unique: true, trim: true, uppercase: true })
    code!: string; // e.g., "PROJECT_CREATE"

    @Prop({ trim: true })
    module!: string; // e.g., "PROJECTS"
}

export type PermissionDocument = HydratedDocument<Permission>;
export const PermissionSchema = SchemaFactory.createForClass(Permission);