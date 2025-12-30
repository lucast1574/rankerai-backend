import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/models/user.model';
import { SubscriptionPlan } from './subscription-plan.model';

@Schema({
    collection: 'user_subscription', // Matches backup exactly
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on',
    },
    versionKey: 'version',
})
export class UserSubscription {
    @Prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId;

    @Prop({ type: Boolean, default: true, index: true })
    active!: boolean;

    @Prop({ trim: true, index: true })
    customer_id!: string;

    @Prop()
    expired_at!: Date;

    @Prop({ trim: true })
    last_activity!: string;

    @Prop({ trim: true, index: true })
    status!: string;

    @Prop({ trim: true })
    subscription!: string;

    @Prop({ trim: true })
    subscription_id!: string;

    @Prop({
        type: Types.ObjectId,
        ref: SubscriptionPlan.name, // Uses the import to fix the warning
        required: true,
        index: true,
    })
    subscription_plan_id!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, index: true })
    user_id!: Types.ObjectId;

    @Prop()
    last_reset_date!: Date;

    @Prop({ type: String })
    configuration_json!: string;

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

export type UserSubscriptionDocument = HydratedDocument<UserSubscription>;
export const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);

// Preserving backup indexing strategy
UserSubscriptionSchema.index({ user_id: 1, active: 1 }, { name: 'idx_sub_user_active' });
UserSubscriptionSchema.index({ user_id: 1, status: 1 }, { name: 'idx_sub_user_status' });