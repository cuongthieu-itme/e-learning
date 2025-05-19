import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as bcrypt from 'bcryptjs';

import { Role } from '@/types';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
    trim: true,
  })
  first_name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
    trim: true,
  })
  last_name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    select: false,
  })
  password?: string;

  @Prop({ type: String, default: 'user', enum: Role })
  role: Role;

  @Prop({ default: false })
  isGoogleAccount: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (user.isModified('password') && user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});
