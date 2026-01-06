import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, IsOptional, IsLowercase } from 'class-validator';

@InputType()
export class CreateRoleInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name!: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    @IsLowercase()
    slug!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => [String], { defaultValue: [] })
    @IsArray()
    @IsString({ each: true })
    permissions!: string[];
}