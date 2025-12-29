import { InputType, Field } from '@nestjs/graphql';
import { RegisterUserInput } from './register-user.input';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateUserInput extends RegisterUserInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    role?: string;

    @Field({ defaultValue: false })
    @IsOptional()
    @IsBoolean()
    allow_free_trial!: boolean;

    @Field({ defaultValue: true })
    @IsOptional()
    @IsBoolean()
    active!: boolean;
}