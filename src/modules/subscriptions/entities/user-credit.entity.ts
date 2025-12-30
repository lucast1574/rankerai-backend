import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class UserCreditEntity {
    @Field(() => ID)
    _id!: string;

    @Field(() => ID)
    user_id!: string;

    @Field(() => ID)
    subscription_id!: string;

    @Field({ nullable: true })
    subscription_from?: string;

    @Field()
    credit_type!: string;

    @Field(() => Float)
    given_credit!: number;

    @Field(() => Float)
    total_credit!: number;

    @Field(() => Float)
    remaining_credit!: number;

    @Field()
    subscription_date!: Date;

    @Field(() => Float, { nullable: true })
    last_rollover?: number;

    @Field({ nullable: true })
    last_reset_date?: Date;

    @Field(() => Boolean)
    is_recurring!: boolean;

    @Field(() => Boolean)
    is_rollover!: boolean;

    @Field(() => Boolean)
    is_one_time!: boolean;

    @Field()
    status!: string;

    @Field(() => Boolean)
    active!: boolean;

    @Field(() => Int)
    version!: number;

    @Field()
    created_on!: Date;

    @Field()
    updated_on!: Date;
}