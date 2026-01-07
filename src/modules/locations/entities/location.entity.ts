import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Geographical location data' })
export class LocationEntity {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    name!: string;

    @Field(() => String)
    country!: string;

    @Field(() => String, { nullable: true })
    region?: string;

    @Field(() => String, { nullable: true })
    postal_code?: string;

    @Field(() => Boolean)
    active!: boolean;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;

    @Field(() => Number)
    version!: number;
}