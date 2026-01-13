import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class GoogleLoginInput {
    @Field({ description: 'The id_token received from Google' })
    @IsNotEmpty()
    idToken!: string;
}