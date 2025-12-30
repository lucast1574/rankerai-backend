import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SubscriptionsService } from '../../modules/subscriptions/subscriptions.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(private subService: SubscriptionsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;

        if (!user) return false;

        // Check if user has an active, valid subscription
        const isValid = await this.subService.checkSubscriptionValidity(user._id.toString());

        if (!isValid) {
            throw new ForbiddenException('You do not have an active subscription or your plan has expired.');
        }

        return true;
    }
}