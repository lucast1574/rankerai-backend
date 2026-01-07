import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({
    collection: 'locations',
    timestamps: true,
    versionKey: false,
})
export class Location {
    @Prop({ required: true, trim: true, index: true })
    name!: string;

    @Prop({ trim: true, index: true, sparse: true, lowercase: true })
    region?: string;

    @Prop({
        required: true,
        trim: true,
        index: true,
        lowercase: true,
        unique: true,
    })
    country!: string;

    @Prop({ trim: true, sparse: true, index: true })
    postal_code?: string;

    @Prop({ default: true, index: true })
    active!: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true, sparse: true })
    created_by?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true, sparse: true })
    updated_by?: Types.ObjectId;

    @Prop({ default: 1 })
    version!: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Optimized compound index for geographical searches
LocationSchema.index({ country: 1, region: 1, name: 1 });