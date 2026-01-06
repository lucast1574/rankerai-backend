import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'sys_document_statuses', timestamps: true })
export class DocumentStatus {
    @Prop({ type: Types.ObjectId, auto: true })
    _id!: Types.ObjectId;

    @Prop({ required: true, unique: true, trim: true })
    name!: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
    slug!: string;

    @Prop({ default: true })
    active!: boolean;
}

export type DocumentStatusDocument = HydratedDocument<DocumentStatus>;
export const DocumentStatusSchema = SchemaFactory.createForClass(DocumentStatus);