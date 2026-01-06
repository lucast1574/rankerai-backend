import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateRoleInput } from './create-role.input';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
    @Field(() => ID)
    @IsMongoId()
    @IsNotEmpty()
    _id!: string;
}