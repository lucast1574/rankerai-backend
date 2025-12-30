import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

@InputType()
export class CreatePermissionInput {
    @Field()
    @IsNotEmpty()
    @IsString()
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