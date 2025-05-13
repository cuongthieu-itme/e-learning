import { IAddress } from './address.types';
import { ICart } from './cart.types';
import { IOrder } from './order.types';
import { IReview } from './review.types';
import { Role } from './shared.types';
import { IWishlist } from './wishlist.types';

export type UpdateProfileDto = {
  first_name?: string;
  last_name?: string;
};

export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  cart: ICart | null;
  wishlist: IWishlist | null;
  orders: IOrder[] | [];
  addresses: IAddress[] | [];
  reviews: IReview[] | [];
  role: Role;
  isGoogleAccount: boolean;
  createdAt: string;
  updatedAt: string;
}
