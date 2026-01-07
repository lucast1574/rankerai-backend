import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Contact information submitted via support/contact forms' })
export class ContactEntity {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    name!: string;

    @Field(() => String)
    email!: string;

    @Field(() => String)
    reason!: string;

    @Field(() => String)
    message!: string;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;
}