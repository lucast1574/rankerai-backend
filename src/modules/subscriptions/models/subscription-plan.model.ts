import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/models/user.model';

@Schema({
    collection: 'subscription_plan',
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on',
    },
    versionKey: 'version',
})
export class SubscriptionPlan {
    @Prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId;

    @Prop({ type: Boolean, default: true, index: true })
    active!: boolean;

    @Prop({ type: Boolean, default: true, index: true })
    is_enabled!: boolean;

    @Prop({ required: true, trim: true, index: true })
    name!: string;

    @Prop({ required: true, unique: true, trim: true, index: true, lowercase: true })
    slug!: string; // Added: Required for findPlanBySlug('free')

    @Prop({ type: Number, default: 0 })
    credits!: number; // Added: Fixed the 'Property credits does not exist' error

    @Prop({ type: Object, default: {} })
    features!: Record<string, any>;

    /** AUDITORÍA */
    @Prop({ type: Types.ObjectId, ref: User.name, index: true })
    created_by!: Types.ObjectId;

    @Prop()
    created_on!: Date;

    @Prop({ type: Types.ObjectId, ref: User.name, index: true })
    updated_by!: Types.ObjectId;

    @Prop()
    updated_on!: Date;

    /** VERSIONADO */
    @Prop({ type: Number, default: 0, index: true })
    version!: number;
}

export type SubscriptionPlanDocument = HydratedDocument<SubscriptionPlan>;
export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);

SubscriptionPlanSchema.index({ slug: 1, active: 1 }); // Added for faster slug lookups
SubscriptionPlanSchema.index({ active: 1, is_enabled: 1 }, { name: 'idx_plan_active_enabled' });
SubscriptionPlanSchema.index({ name: 1, active: 1 }, { name: 'idx_plan_name_active' });