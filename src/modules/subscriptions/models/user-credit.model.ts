import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserSubscription } from './user-subscription.model';
import { User } from '../../users/models/user.model';

@Schema({
    collection: 'user_credit', // Matches backup exactly
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on',
    },
    versionKey: 'version',
})
export class UserCredit {
    @Prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    user_id!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: UserSubscription.name, required: true, index: true })
    subscription_id!: Types.ObjectId;

    @Prop({ trim: true })
    subscription_from!: string;

    @Prop({ trim: true, index: true })
    credit_type!: string;

    @Prop({ type: Number })
    given_credit!: number;

    @Prop({ type: Number })
    total_credit!: number;

    @Prop({ type: Number })
    remaining_credit!: number;

    @Prop()
    subscription_date!: Date;

    @Prop({ type: Number })
    last_rollover!: number;

    @Prop()
    last_reset_date!: Date;

    @Prop({ default: false })
    is_recurring!: boolean;

    @Prop({ default: false })
    is_rollover!: boolean;

    @Prop({ default: false })
    is_one_time!: boolean;

    @Prop({ trim: true, index: true })
    status!: string;

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

    /** VERSIONADO */
    @Prop({ type: Number, default: 0, index: true })
    version!: number;
}

export type UserCreditDocument = HydratedDocument<UserCredit>;
export const UserCreditSchema = SchemaFactory.createForClass(UserCredit);

/** INDEXING STRATEGY (Matched with backup) */
UserCreditSchema.index({ user_id: 1, active: 1 }, { name: 'idx_credit_user_active' });
UserCreditSchema.index({ user_id: 1, status: 1 }, { name: 'idx_credit_user_status' });
UserCreditSchema.index({ subscription_id: 1, active: 1 }, { name: 'idx_credit_subscription_active' });