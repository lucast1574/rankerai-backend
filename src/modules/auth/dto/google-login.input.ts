import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

// This name 'IdTokenGoogleAuthInput' matches what your Frontend sends
@InputType('IdTokenGoogleAuthInput')
export class GoogleLoginInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    idToken!: string; // <--- The '!' fixes the "no initializer" error
}