import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/models/user.model';

@Schema({
    collection: 'user_usage_log', // Matches backup exactly
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on',
    },
    versionKey: 'version',
})
export class UserUsageLog {
    @Prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, index: true })
    usage_id!: Types.ObjectId;

    @Prop({ trim: true, index: true })
    usage_type!: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    user_id!: Types.ObjectId;

    @Prop({ index: true })
    date!: Date;

    @Prop({ type: Number })
    usage!: number;

    @Prop({ type: String })
    usage_data!: string;

    @Prop({ type: Boolean, default: true, index: true })
    active!: boolean;

    /** AUDITORÍA */
    @Prop({ type: Types.ObjectId, ref: User.name, index: true })
    created_by!: Types.ObjectId;

    @Prop()
    created_on!: Date;

    @Prop({ type: Types.ObjectId, ref: User.name, index: true })
    updated_by!: Types.ObjectId;

    @Prop()
    updated_on!: Date;

    @Prop({ type: Number, default: 0, index: true })
    version!: number;

    @Prop({ trim: true })
    project_type!: string;

    @Prop({ type: Types.ObjectId, ref: 'Project', index: true })
    project_id!: Types.ObjectId;
}

export type UserUsageLogDocument = HydratedDocument<UserUsageLog>;
export const UserUsageLogSchema = SchemaFactory.createForClass(UserUsageLog);

/** INDEXING STRATEGY (Matched with backup) */
UserUsageLogSchema.index({ user_id: 1, date: -1 }, { name: 'idx_usage_user_date' });
UserUsageLogSchema.index({ project_id: 1, active: 1 }, { name: 'idx_usage_project_active' });
UserUsageLogSchema.index({ user_id: 1, usage_type: 1 }, { name: 'idx_usage_user_type' });