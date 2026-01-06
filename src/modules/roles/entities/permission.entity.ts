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
    created_at?: Date; // Matches schema 'created_at'

    @Field({ nullable: true })
    updated_at?: Date; // Added for consistency

    @Field(() => ID, { nullable: true })
    created_by?: string;
}