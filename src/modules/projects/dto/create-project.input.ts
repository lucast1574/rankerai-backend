import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateProjectInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name!: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    slug?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    metadata?: string; // Can be passed as a JSON string
}