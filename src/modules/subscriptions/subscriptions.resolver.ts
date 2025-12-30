import { Resolver, Query, Args, Mutation, Float, Int } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UserSubscriptionEntity } from './entities/user-subscription.entity';
import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { UserCreditEntity } from './entities/user-credit.entity';

@Resolver()
export class SubscriptionsResolver {
    constructor(private readonly subService: SubscriptionsService) { }

    @Query(() => [SubscriptionPlanEntity], { name: 'availablePlans' })
    async getPlans() {
        return this.subService.findAllPlans();
    }

    @Query(() => UserSubscriptionEntity, { name: 'mySubscription' })
    async getMySubscription(@CurrentUser() user: any) {
        return this.subService.findUserSubscription(user.sub);
    }

    @Query(() => UserCreditEntity, { name: 'myCreditBalance' })
    async getMyCreditBalance(@CurrentUser() user: any) {
        return this.subService.getUserCreditBalance(user.sub);
    }

    // NEW: Expose plan limit validation to the API
    @Query(() => Boolean, { name: 'checkFeatureAccess' })
    async checkAccess(
        @CurrentUser() user: any,
        @Args('featureKey') featureKey: string,
        @Args('currentCount', { type: () => Int }) currentCount: number,
    ) {
        return this.subService.validatePlanFeature(user.sub, featureKey, currentCount);
    }

    @Mutation(() => Boolean, { name: 'testConsumeCredit' })
    async testConsume(
        @CurrentUser() user: any,
        @Args('amount', { type: () => Float }) amount: number,
        @Args('type') type: string,
    ) {
        await this.subService.consumeCredit(user.sub, amount, type);
        return true;
    }
}