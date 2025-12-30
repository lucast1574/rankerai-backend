import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class RoleEntity {
    @Field(() => ID)
    _id!: string;

    @Field()
    name!: string;

    @Field()
    slug!: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => [String])
    permissions!: string[];

    @Field(() => Boolean)
    active!: boolean;

    @Field(() => Int)
    version!: number;

    @Field({ nullable: true })
    created_on?: Date;

    @Field({ nullable: true })
    updated_on?: Date;
}