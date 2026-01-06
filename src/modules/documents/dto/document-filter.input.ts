import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsMongoId, IsString } from 'class-validator';

@InputType()
export class DocumentFilterInput {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsMongoId()
    project_id?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    type_slug?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    status_slug?: string;
}