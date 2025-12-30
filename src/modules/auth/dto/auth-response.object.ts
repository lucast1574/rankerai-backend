import { ObjectType, Field } from '@nestjs/graphql';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
    @Field({ description: 'JWT access token for authentication' })
    access_token!: string;

    @Field({ description: 'JWT refresh token to obtain new access tokens' })
    refresh_token!: string;

    @Field(() => UserEntity, { description: 'The authenticated user profile' })
    user!: UserEntity;
}