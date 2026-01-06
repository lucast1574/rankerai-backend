import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
    collection: 'app_projects',
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: 'version',
})
export class Project {
    @Prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name!: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true })
    slug!: string;

    @Prop({ trim: true })
    description?: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    owner_id!: Types.ObjectId;

    @Prop({ default: true, index: true })
    active!: boolean;

    /** AUDIT FIELDS */
    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    created_by?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    updated_by?: Types.ObjectId;

    @Prop({ default: 0 })
    version!: number;

    @Prop({ type: Map, of: String, default: {} })
    metadata!: Map<string, string>;
}

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ owner_id: 1, active: 1 });
ProjectSchema.index({ slug: 1, active: 1 });