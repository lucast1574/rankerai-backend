import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
    collection: 'app_roles',
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: 'version',
})
export class Role {
    @Prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId;

    @Prop({ required: true, unique: true, trim: true })
    name!: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true })
    slug!: string;

    @Prop({ trim: true })
    description?: string;

    @Prop({ type: [String], default: [] })
    permissions!: string[];

    @Prop({ default: true, index: true })
    active!: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    created_by?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    updated_by?: Types.ObjectId;

    @Prop({ default: 0 })
    version!: number;
}

export type RoleDocument = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ slug: 1, active: 1 });