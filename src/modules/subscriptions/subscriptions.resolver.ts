import { Resolver, Query, Args, Mutation, Float, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../core/guards/auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UserSubscriptionEntity } from './entities/user-subscription.entity';
import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { UserCreditEntity } from './entities/user-credit.entity';

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard) // FIX: Added guards to enable Role/Auth checks
export class SubscriptionsResolver {
    constructor(private readonly subService: SubscriptionsService) { }

    @Query(() => [SubscriptionPlanEntity], { name: 'availablePlans' })
    async getPlans() {
        return this.subService.findAllPlans();
    }

    @Query(() => UserSubscriptionEntity, { name: 'mySubscription' })
    async getMySubscription(@CurrentUser() user: any) {
        // FIX: user.sub changed to user._id.toString()
        return this.subService.findUserSubscription(user._id.toString());
    }

    @Query(() => UserCreditEntity, { name: 'myCreditBalance' })
    async getMyCreditBalance(@CurrentUser() user: any) {
        // FIX: user.sub changed to user._id.toString()
        return this.subService.getUserCreditBalance(user._id.toString());
    }

    @Query(() => Boolean, { name: 'checkFeatureAccess' })
    async checkAccess(
        @CurrentUser() user: any,
        @Args('featureKey') featureKey: string,
        @Args('currentCount', { type: () => Int }) currentCount: number,
    ) {
        // FIX: user.sub changed to user._id.toString()
        return this.subService.validatePlanFeature(user._id.toString(), featureKey, currentCount);
    }

    @Mutation(() => Boolean, { name: 'testConsumeCredit' })
    async testConsume(
        @CurrentUser() user: any,
        @Args('amount', { type: () => Float }) amount: number,
        @Args('type') type: string,
    ) {
        // FIX: user.sub changed to user._id.toString()
        await this.subService.consumeCredit(user._id.toString(), amount, type);
        return true;
    }
}