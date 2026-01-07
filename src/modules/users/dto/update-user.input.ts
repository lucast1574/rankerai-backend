import { InputType, Field, PartialType } from '@nestjs/graphql';
import { RegisterUserInput } from './register-user.input';
import { IsOptional, IsString, IsDate } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    work_pattern?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sitemap_url?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    reset_password_token?: string;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    @IsDate()
    reset_password_expires?: Date;
}