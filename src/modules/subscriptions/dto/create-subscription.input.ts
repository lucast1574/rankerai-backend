import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateSubscriptionInput {
    @Field(() => ID)
    @IsNotEmpty()
    planId!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    couponCode?: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    paymentMethodId!: string;
}