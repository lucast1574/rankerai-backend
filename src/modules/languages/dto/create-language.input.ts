import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

@InputType({ description: 'Data to create a new supported language' })
export class CreateLanguageInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    locale!: string;

    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}