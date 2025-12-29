import { InputType, Field, PartialType } from '@nestjs/graphql';
import { RegisterUserInput } from './register-user.input';
import { IsOptional, IsString } from 'class-validator';

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
}