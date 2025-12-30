import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserSubscription, UserSubscriptionDocument } from './models/user-subscription.model';
import { SubscriptionPlan, SubscriptionPlanDocument } from './models/subscription-plan.model';
import { UserUsageLog, UserUsageLogDocument } from './models/user-usage-log.model';
import { UserCredit, UserCreditDocument } from './models/user-credit.model';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectModel(UserSubscription.name)
        private userSubModel: Model<UserSubscriptionDocument>,
        @InjectModel(SubscriptionPlan.name)
        private planModel: Model<SubscriptionPlanDocument>,
        @InjectModel(UserUsageLog.name)
        private usageLogModel: Model<UserUsageLogDocument>,
        @InjectModel(UserCredit.name)
        private creditModel: Model<UserCreditDocument>,
    ) { }

    /**
     * NEW: Validates if a user can perform an action based on their plan limits.
     * Usage: await service.validatePlanFeature(userId, 'max_projects', 10)
     */
    async validatePlanFeature(userId: string, featureKey: string, currentCount: number): Promise<boolean> {
        const sub = await this.userSubModel
            .findOne({ user_id: new Types.ObjectId(userId), active: true })
            .populate('subscription_plan_id')
            .exec();

        if (!sub || !sub.subscription_plan_id) throw new NotFoundException('Active plan not found');

        // Access the feature from the plan model
        const plan = sub.subscription_plan_id as any;
        const limit = plan.features?.[featureKey];

        // If a limit exists and current usage exceeds it, block the action
        if (limit !== undefined && currentCount >= limit) {
            throw new BadRequestException(`Limit reached for ${featureKey}. Your plan allows only ${limit}.`);
        }

        return true;
    }

    async findUserSubscription(userId: string): Promise<UserSubscriptionDocument> {
        const sub = await this.userSubModel
            .findOne({ user_id: new Types.ObjectId(userId), active: true })
            .populate('subscription_plan_id')
            .exec();
        if (!sub) throw new NotFoundException('No active subscription found');
        return sub;
    }

    async consumeCredit(userId: string, amount: number, type: string, projectId?: string): Promise<void> {
        const userCredit = await this.creditModel.findOne({
            user_id: new Types.ObjectId(userId),
            active: true,
            status: 'ACTIVE'
        });

        if (!userCredit || userCredit.remaining_credit < amount) {
            throw new BadRequestException('Insufficient credits for this action');
        }

        userCredit.remaining_credit -= amount;
        userCredit.updated_on = new Date();
        await userCredit.save();

        await this.usageLogModel.create({
            user_id: new Types.ObjectId(userId),
            usage: amount,
            usage_type: type,
            date: new Date(),
            project_id: projectId ? new Types.ObjectId(projectId) : undefined,
            active: true,
            version: 0,
            created_by: new Types.ObjectId(userId),
        } as any);
    }

    async getUserCreditBalance(userId: string): Promise<UserCreditDocument> {
        const credit = await this.creditModel.findOne({ user_id: new Types.ObjectId(userId), active: true });
        if (!credit) throw new NotFoundException('Credit record not found');
        return credit;
    }

    async findAllPlans(): Promise<SubscriptionPlanDocument[]> {
        return this.planModel.find({ active: true, is_enabled: true }).exec();
    }
}