import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true })
  login: string;

  @Prop({ type: String, required: true, trim: true, minLength: 6 })
  password: string;

  @Prop({ type: String, required: true, trim: true })
  fullname: string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    uniqueCaseInsensitive: true
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    trim: true
  })
  phone: string;

  @Prop({ type: Number, min: 5, max: 90, default: 15 })
  timeout: number;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;

  @Prop({ type: [String], default: [] })
  scope: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
