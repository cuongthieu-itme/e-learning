import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '@/models/user/schema/user.schema';
import { Product } from '@/models/product/schema/product.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User & mongoose.Types.ObjectId;

  @Prop([
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, min: 1, required: true, default: 1 },
      attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
  ])
  items: {
    product: Product | mongoose.Types.ObjectId;
    quantity: number;
    attributes: Record<string, any>;
  }[];

  @Prop({ type: Number, default: 0 })
  totalPrice?: number;

  @Prop({ type: Boolean, default: false })
  isActive?: boolean;

  @Prop({ type: String, default: null })
  couponApplied?: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
