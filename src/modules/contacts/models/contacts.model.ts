import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'contacts',
})
export class Contact {
    @Prop({ required: true, trim: true, minlength: 1, maxlength: 120 })
    name!: string; // Added ! here

    @Prop({
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
        index: true,
    })
    email!: string; // Added ! here

    @Prop({ required: true, trim: true, maxlength: 120, index: true })
    reason!: string; // Added ! here

    @Prop({ required: true, trim: true, maxlength: 5000 })
    message!: string; // Added ! here
}

export const ContactSchema = SchemaFactory.createForClass(Contact);