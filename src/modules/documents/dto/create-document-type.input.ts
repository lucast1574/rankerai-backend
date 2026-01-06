import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

@InputType()
export class CreateDocumentTypeInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase and contain only letters, numbers, and hyphens' })
    slug!: string;

    @Field({ nullable: true })
    @IsOptional()
    active?: boolean;
}