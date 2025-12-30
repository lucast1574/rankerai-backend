import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class UserUsageLogEntity {
    @Field(() => ID)
    _id!: string;

    @Field(() => ID, { nullable: true })
    usage_id?: string;

    @Field()
    usage_type!: string;

    @Field(() => ID)
    user_id!: string;

    @Field()
    date!: Date;

    @Field(() => Float)
    usage!: number;

    @Field({ nullable: true })
    usage_data?: string;

    @Field(() => Boolean)
    active!: boolean;

    @Field(() => Int)
    version!: number;

    @Field({ nullable: true })
    project_type?: string;

    @Field(() => ID, { nullable: true })
    project_id?: string;

    @Field()
    created_on!: Date;

    @Field()
    updated_on!: Date;
}