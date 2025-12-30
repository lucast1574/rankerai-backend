import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/models/user.model';

@Schema({
    collection: 'subscription_plan', // Matches backup exactly
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on',
    },
    versionKey: 'version',
})
export class SubscriptionPlan {
    @Prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId; // Fixed: added ! for definite assignment

    @Prop({ type: Boolean, default: true, index: true })
    active!: boolean;

    @Prop({ type: Boolean, default: true, index: true })
    is_enabled!: boolean;

    @Prop({ required: true, trim: true, index: true })
    name!: string;

    /** AUDITORÍA (Matches backup exactly) */
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

// Preserving backup indexing strategy
SubscriptionPlanSchema.index({ active: 1, is_enabled: 1 }, { name: 'idx_plan_active_enabled' });
SubscriptionPlanSchema.index({ name: 1, active: 1 }, { name: 'idx_plan_name_active' });