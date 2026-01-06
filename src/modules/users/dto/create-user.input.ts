import { InputType, Field, ID } from '@nestjs/graphql';
import { RegisterUserInput } from './register-user.input';
import { IsBoolean, IsOptional, IsMongoId } from 'class-validator';

@InputType()
export class CreateUserInput extends RegisterUserInput {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsMongoId()
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