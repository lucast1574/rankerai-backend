import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { SubscriptionPlanEntity } from './subscription-plan.entity';

@ObjectType()
export class UserSubscriptionEntity {
    @Field(() => ID)
    _id!: string;

    @Field(() => Boolean)
    active!: boolean;

    @Field()
    customer_id!: string;

    @Field({ nullable: true })
    expired_at?: Date;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    subscription_id?: string;

    @Field(() => SubscriptionPlanEntity)
    plan!: SubscriptionPlanEntity;

    @Field(() => ID)
    user_id!: string;

    @Field({ nullable: true })
    configuration_json?: string;

    @Field(() => Int)
    version!: number;
}