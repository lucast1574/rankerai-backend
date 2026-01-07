import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@InputType({ description: 'Data required to create a new contact entry' })
export class CreateContactInput {
    @Field(() => String, { description: 'Full name of the person' })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(120)
    name!: string;

    @Field(() => String, { description: 'Email address for response' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(254)
    email!: string;

    @Field(() => String, { description: 'Reason for contacting support' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    reason!: string;

    @Field(() => String, { description: 'Detailed message or inquiry' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    message!: string;
}