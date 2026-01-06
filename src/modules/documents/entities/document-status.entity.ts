import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class DocumentStatusEntity {
    @Field(() => ID)
    _id!: string;

    @Field()
    name!: string;

    @Field()
    slug!: string;

    @Field(() => Boolean)
    active!: boolean;
}