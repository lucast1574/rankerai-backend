import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
    @Field()
    success!: boolean; // <--- This must be present and decorated with @Field()

    @Field()
    message!: string;

    @Field()
    access_token!: string;

    @Field()
    refresh_token!: string;

    @Field(() => Int)
    expires_token!: number;

    @Field(() => UserEntity)
    user!: UserEntity;
}