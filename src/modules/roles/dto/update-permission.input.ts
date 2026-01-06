import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreatePermissionInput } from './create-permission.input';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {
    @Field(() => ID)
    @IsMongoId()
    @IsNotEmpty()
    _id!: string;
}