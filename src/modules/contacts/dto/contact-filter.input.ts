import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEmail } from 'class-validator';

@InputType({ description: 'Filters for querying contact submissions' })
export class ContactFilterInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    reason?: string;

    @Field(() => String, { nullable: true, description: 'Search term for the message content' })
    @IsOptional()
    @IsString()
    searchTerm?: string;
}