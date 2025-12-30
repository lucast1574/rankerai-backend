import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { UserSubscription, UserSubscriptionSchema } from './models/user-subscription.model';
import { SubscriptionPlan, SubscriptionPlanSchema } from './models/subscription-plan.model';
import { UserUsageLog, UserUsageLogSchema } from './models/user-usage-log.model';
import { UserCredit, UserCreditSchema } from './models/user-credit.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserSubscription.name, schema: UserSubscriptionSchema },
            { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
            { name: UserUsageLog.name, schema: UserUsageLogSchema },
            { name: UserCredit.name, schema: UserCreditSchema },
        ]),
    ],
    providers: [SubscriptionsService, SubscriptionsResolver],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule { }