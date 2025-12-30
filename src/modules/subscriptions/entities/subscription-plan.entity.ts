import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class SubscriptionPlanEntity {
    @Field(() => ID)
    _id!: string;

    @Field()
    name!: string;

    @Field(() => Boolean)
    active!: boolean;

    @Field(() => Boolean)
    is_enabled!: boolean;

    @Field(() => Int)
    version!: number;

    @Field({ nullable: true })
    created_on?: Date;

    @Field({ nullable: true })
    updated_on?: Date;
}