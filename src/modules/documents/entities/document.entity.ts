import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class DocumentEntity {
    @Field(() => ID)
    _id!: string;

    @Field()
    title!: string;

    @Field(() => ID)
    type_id!: string;

    @Field(() => GraphQLJSON)
    content!: any;

    @Field(() => ID)
    project_id!: string;

    @Field(() => ID)
    owner_id!: string;

    @Field(() => ID)
    status_id!: string;

    @Field(() => Int)
    version!: number;

    @Field()
    created_on!: Date;

    @Field()
    updated_on!: Date;
}