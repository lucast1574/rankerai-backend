import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

@InputType({ description: 'Data to create a new geographical location' })
export class CreateLocationInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    country!: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    region?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    postal_code?: string;

    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}