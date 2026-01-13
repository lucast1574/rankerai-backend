import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
    @Field(() => Boolean, { description: 'Indicates if the operation was successful' })
    success!: boolean;

    @Field()
    message!: string;

    @Field({ description: 'JWT access token for authentication' })
    access_token!: string;

    @Field({ description: 'JWT refresh token to obtain new access tokens' })
    refresh_token!: string;

    @Field(() => Int, { description: 'Timestamp when the token expires' })
    expires_token!: number;

    @Field(() => UserEntity, { description: 'The authenticated user profile' })
    user!: UserEntity;
}