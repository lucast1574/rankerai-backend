import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
    @Field()
    @IsEmail()
    email!: string;

    @Field()
    @IsNotEmpty()
    first_name!: string;

    @Field()
    @IsNotEmpty()
    last_name!: string;

    @Field()
    @IsNotEmpty()
    @MinLength(6)
    password!: string;
}