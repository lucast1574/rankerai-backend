import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Supported application language' })
export class LanguageEntity {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    name!: string;

    @Field(() => String)
    locale!: string;

    @Field(() => Boolean)
    active!: boolean;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;

    @Field(() => Number)
    version!: number;
}