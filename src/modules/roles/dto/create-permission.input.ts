import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUppercase, MinLength } from 'class-validator';

@InputType()
export class CreatePermissionInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name!: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    @IsUppercase()
    code!: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    module!: string;
}