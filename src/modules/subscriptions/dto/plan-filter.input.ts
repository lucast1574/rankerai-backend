import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class PlanFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    onlyActive?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    onlyEnabled?: boolean;
}