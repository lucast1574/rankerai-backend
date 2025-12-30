import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class SubscriptionPlanEntity {
    @Field(() => ID)
    _id!: string;

    @Field()
    name!: string;

    @Field()
    slug!: string; // Added to Entity

    @Field(() => Int)
    credits!: number; // Added to Entity

    @Field(() => Boolean)
    active!: boolean;

    @Field(() => Boolean)
    is_enabled!: boolean;

    @Field(() => GraphQLJSON, { nullable: true })
    features?: any;

    @Field(() => Int)
    version!: number;

    @Field({ nullable: true })
    created_on?: Date;

    @Field({ nullable: true })
    updated_on?: Date;
}