import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

@InputType()
export class CreateDocumentStatusInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name!: string; // e.g., "Draft"

    @Field()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase and contain only letters, numbers, and hyphens' })
    slug!: string; // e.g., "draft"

    @Field({ nullable: true })
    @IsOptional()
    active?: boolean;
}