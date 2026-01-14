import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
    collection: 'users',
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    collation: { locale: 'en', strength: 2 },
})
export class User {
    @Prop({ default: true, index: true })
    active!: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    created_by?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    updated_by?: Types.ObjectId;

    @Prop({ default: 1 })
    version!: number;

    @Prop({ index: true, sparse: true, trim: true })
    activation_code?: string;

    @Prop()
    activation_code_expiration_date?: Date;

    @Prop({ default: 'CREDENTIALS', index: true })
    auth_provider!: string;

    @Prop({ required: true, unique: true, index: true, trim: true, lowercase: true })
    email!: string;

    @Prop({ required: true, trim: true })
    first_name!: string;

    @Prop({ trim: true })
    last_name?: string;

    @Prop({ trim: true })
    avatar?: string;

    @Prop({ select: false })
    password_hash?: string;

    @Prop({ default: false, index: true })
    locked!: boolean;

    @Prop({ default: false, index: true })
    is_registered!: boolean;

    @Prop({ type: Types.ObjectId, ref: 'Role', index: true })
    role?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    parent_id?: Types.ObjectId;

    @Prop({ index: true })
    last_login?: Date;

    @Prop({ default: 0 })
    no_of_login!: number;

    @Prop({ index: true, sparse: true, lowercase: true, trim: true })
    domain?: string;

    @Prop({ type: Types.ObjectId, ref: 'Language', index: true })
    language_id?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Location', index: true })
    location_id?: Types.ObjectId;

    @Prop({ index: true, sparse: true, trim: true })
    sitemap_url?: string;

    @Prop({ trim: true, sparse: true, index: true })
    work_pattern?: string;

    @Prop({ default: false, index: true })
    allow_free_trial!: boolean;

    @Prop({ index: true, sparse: true })
    reset_password_token?: string;

    @Prop()
    reset_password_expires?: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, active: 1 });
UserSchema.index({ parent_id: 1, role: 1 });
UserSchema.index({ domain: 1, active: 1 });
UserSchema.index({ role: 1, active: 1 });
UserSchema.index({ created_on: -1 });
UserSchema.index({ last_login: -1 });
UserSchema.index({ first_name: 1, last_name: 1 });