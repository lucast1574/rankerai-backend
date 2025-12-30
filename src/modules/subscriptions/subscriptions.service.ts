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

    async findPlanBySlug(slug: string): Promise<SubscriptionPlanDocument | null> {
        return this.planModel.findOne({ slug, active: true }).exec();
    }

    async createInitialSubscription(userId: string, planId: string): Promise<UserSubscriptionDocument> {
        const plan = await this.planModel.findById(planId);
        if (!plan) throw new NotFoundException('Subscription plan not found');

        const sub = new this.userSubModel({
            user_id: new Types.ObjectId(userId),
            subscription_plan_id: plan._id,
            active: true,
            status: 'ACTIVE',
            created_by: new Types.ObjectId(userId),
        });

        // Initialize user credits record based on the plan
        await this.creditModel.create({
            user_id: new Types.ObjectId(userId),
            subscription_id: sub._id,
            total_credit: plan.credits || 0,
            remaining_credit: plan.credits || 0,
            status: 'ACTIVE',
            active: true,
            created_by: new Types.ObjectId(userId),
        });

        return sub.save();
    }

    async checkSubscriptionValidity(userId: string): Promise<boolean> {
        const sub = await this.userSubModel.findOne({
            user_id: new Types.ObjectId(userId),
            active: true
        });

        if (!sub) return false;

        // Check for hard-coded expiration date
        if (sub.expired_at && sub.expired_at < new Date()) {
            sub.active = false;
            sub.status = 'EXPIRED';
            await sub.save();
            return false;
        }
        return true;
    }

    async validatePlanFeature(userId: string, featureKey: string, currentCount: number): Promise<boolean> {
        const sub = await this.userSubModel
            .findOne({ user_id: new Types.ObjectId(userId), active: true })
            .populate('subscription_plan_id')
            .exec();

        if (!sub || !sub.subscription_plan_id) throw new NotFoundException('Active plan not found');

        const plan = sub.subscription_plan_id as any;
        const limit = plan.features?.[featureKey];

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
        });
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