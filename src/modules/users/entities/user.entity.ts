import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { RoleEntity } from '../../roles/entities/role.entity';

@ObjectType()
export class UserEntity {
    @Field(() => ID)
    _id!: string;

    @Field({ defaultValue: true })
    active!: boolean;

    @Field(() => ID, { nullable: true })
    created_by?: string;

    @Field(() => ID, { nullable: true })
    updated_by?: string;

    @Field(() => Int, { defaultValue: 1 })
    version!: number;

    @Field({ nullable: true })
    activation_code?: string;

    @Field(() => Date, { nullable: true })
    activation_code_expiration_date?: Date;

    @Field({ defaultValue: 'CREDENTIALS' })
    auth_provider!: string;

    @Field()
    email!: string;

    @Field()
    first_name!: string;

    @Field()
    last_name!: string;

    @Field({ defaultValue: false })
    locked!: boolean;

    @Field({ defaultValue: false })
    is_registered!: boolean;

    @Field(() => RoleEntity, { nullable: true }) // Returns the full Role object
    role?: RoleEntity;

    @Field(() => ID, { nullable: true })
    parent_id?: string;

    @Field(() => Date, { nullable: true })
    last_login?: Date;

    @Field(() => Int, { defaultValue: 0 })
    no_of_login!: number;

    @Field({ nullable: true })
    domain?: string;

    @Field(() => ID, { nullable: true })
    language_id?: string;

    @Field(() => ID, { nullable: true })
    location_id?: string;

    @Field({ nullable: true })
    sitemap_url?: string;

    @Field({ nullable: true })
    work_pattern?: string;

    @Field({ defaultValue: false })
    allow_free_trial!: boolean;

    @Field(() => Date)
    created_on!: Date;

    @Field(() => Date)
    updated_on!: Date;
}