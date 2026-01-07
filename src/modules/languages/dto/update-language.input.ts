import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateLanguageInput } from './create-language.input';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType({ description: 'Data to update an existing language' })
export class UpdateLanguageInput extends PartialType(CreateLanguageInput) {
    @Field(() => ID)
    @IsMongoId()
    @IsNotEmpty()
    id!: string;
}