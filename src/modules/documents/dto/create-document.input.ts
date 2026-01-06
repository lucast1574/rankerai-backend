import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateDocumentInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    type_slug!: string; // e.g., 'seo-analysis'

    @Field(() => GraphQLJSON)
    @IsNotEmpty()
    content!: any;

    @Field(() => ID)
    @IsMongoId()
    @IsNotEmpty()
    project_id!: string;

    @Field({ nullable: true })
    @IsString()
    status_slug?: string; // Default 'draft' handled in service
}