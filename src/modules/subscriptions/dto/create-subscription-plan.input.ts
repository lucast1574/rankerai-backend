import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateSubscriptionPlanInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name!: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    slug!: string; // e.g., 'free', 'pro-yearly'

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    credits!: number; // Fixed the missing credits field

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    features?: any; // Fixed the missing features field

    @Field(() => Boolean, { defaultValue: true })
    @IsOptional()
    is_enabled?: boolean;
}