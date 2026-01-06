import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
    collection: 'app_permissions',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class Permission {
    @Prop({ required: true, unique: true, trim: true })
    name!: string; // e.g., "Create Project"

    @Prop({ required: true, unique: true, trim: true, uppercase: true, index: true })
    code!: string; // e.g., "PROJECT_CREATE"

    @Prop({ required: true, trim: true, index: true })
    module!: string; // e.g., "PROJECTS"

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    created_by?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    updated_by?: Types.ObjectId;
}

export type PermissionDocument = HydratedDocument<Permission>;
export const PermissionSchema = SchemaFactory.createForClass(Permission);