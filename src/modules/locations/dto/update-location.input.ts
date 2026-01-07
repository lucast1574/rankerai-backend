import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateLocationInput } from './create-location.input';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType({ description: 'Data to update an existing location' })
export class UpdateLocationInput extends PartialType(CreateLocationInput) {
    @Field(() => ID)
    @IsMongoId()
    @IsNotEmpty()
    id!: string;
}