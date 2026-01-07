import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateContactInput } from './create-contact.input';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType({ description: 'Data required to update an existing contact entry' })
export class UpdateContactInput extends PartialType(CreateContactInput) {
    @Field(() => ID, { description: 'The unique ID of the contact to update' })
    @IsMongoId()
    @IsNotEmpty()
    id!: string;
}