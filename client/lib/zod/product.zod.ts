import { z } from 'zod';
import { sanitizeInput } from '../utils';

const BaseProductSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required.' })
    .min(2, 'Product name must have at least 2 characters.')
    .max(25, 'Product name must have at most 25 characters.')
    .transform((value) => sanitizeInput(value)),

  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number.' })
    .positive()
    .min(0, 'Price cannot be negative.')
    .max(100000, 'Price cannot exceed 100,000.'),

  description: z
    .string({ required_error: 'Description is required.' })
    .min(10, 'Description must be at least 10 characters long.')
    .max(1000, 'Description must be at most 1000 characters long.'),

  stock: z.coerce
    .number({ invalid_type_error: 'Stock must be a number.' })
    .min(0, 'Stock cannot be negative.')
    .max(1000),

  discount: z.coerce
    .number({ invalid_type_error: 'Discount must be a number.' })
    .min(0, 'Discount cannot be negative.')
    .max(100)
    .optional(),

  category: z.coerce
    .number({ invalid_type_error: 'Category must be selected.' })
    .min(1, 'Category must be selected.'),

  attributes: z.record(z.any()).optional(),

  images: z
    .array(z.any())
    .min(1, 'At least one image is required.')
    .max(10, 'Cannot upload more than 10 images.'),
});

export const CreateProductSchema = BaseProductSchema.superRefine(
  (data, ctx) => {
    if (data.discount !== undefined && data.discount > data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Discount cannot be greater than the price.',
        path: ['discount'],
      });
    }
  },
);

export const UpdateProductSchema = BaseProductSchema.partial().superRefine(
  (data, ctx) => {
    if (
      data.discount !== undefined &&
      data.price !== undefined &&
      data.discount > data.price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Discount cannot be greater than the price.',
        path: ['discount'],
      });
    }
  },
);
