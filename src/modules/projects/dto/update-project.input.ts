import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateProjectInput } from './create-project.input';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
    @Field(() => ID)
    @IsMongoId()
    @IsNotEmpty()
    _id!: string;
}