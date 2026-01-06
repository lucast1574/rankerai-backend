import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class ProjectEntity {
    @Field(() => ID)
    _id!: string;

    @Field()
    name!: string;

    @Field()
    slug!: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => ID)
    owner_id!: string;

    @Field(() => Boolean)
    active!: boolean;

    @Field(() => Int)
    version!: number;

    @Field(() => GraphQLJSON, { nullable: true })
    metadata?: any;

    @Field()
    created_on!: Date;

    @Field()
    updated_on!: Date;
}