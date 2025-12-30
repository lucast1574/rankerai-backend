import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PermissionEntity {
    @Field(() => ID)
    _id!: string;

    @Field()
    name!: string;

    @Field()
    code!: string;

    @Field()
    module!: string;

    @Field({ nullable: true })
    createdAt?: Date;
}