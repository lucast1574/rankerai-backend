import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
    collection: 'app_documents',
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: 'version',
})
export class Document {
    @Prop({ required: true, trim: true })
    title!: string;

    @Prop({ type: Types.ObjectId, ref: 'DocumentType', required: true, index: true })
    type_id!: Types.ObjectId;

    @Prop({ type: Object, required: true })
    content!: any;

    @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
    project_id!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    owner_id!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'DocumentStatus', required: true, index: true })
    status_id!: Types.ObjectId;

    @Prop({ default: 0 })
    version!: number;
}

export type DocumentDocument = HydratedDocument<Document>;
export const DocumentSchema = SchemaFactory.createForClass(Document);