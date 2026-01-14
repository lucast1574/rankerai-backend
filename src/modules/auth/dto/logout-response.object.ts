import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LogoutResponse {
    @Field()
    success!: boolean;

    @Field({ nullable: true })
    message?: string;
}