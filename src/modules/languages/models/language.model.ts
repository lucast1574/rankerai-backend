import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LanguageDocument = HydratedDocument<Language>;

@Schema({
    collection: 'languages',
    timestamps: true, // Automatically manages createdAt and updatedAt
    versionKey: false,
})
export class Language {
    @Prop({ required: true, trim: true, unique: true, index: true })
    name!: string;

    @Prop({
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        index: true,
    })
    locale!: string;

    @Prop({ default: true, index: true })
    active!: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true, sparse: true })
    created_by?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true, sparse: true })
    updated_by?: Types.ObjectId;

    @Prop({ default: 1 })
    version!: number;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);