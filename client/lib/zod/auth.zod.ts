import { z } from 'zod';

import { PASSWORD_REGEX } from '@/constants';
import { sanitizeInput } from '@/lib/utils';

export const SignupSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'Tên phải có ít nhất 2 ký tự' })
    .max(15, { message: 'Tên phải có tối đa 15 ký tự' })
    .regex(
      /^[A-Z][a-zA-Z\s]*$/,
      'Tên phải bắt đầu bằng chữ hoa',
    )
    .transform((value) => sanitizeInput(value)),
  last_name: z
    .string()
    .min(2, { message: 'Họ phải có ít nhất 2 ký tự' })
    .max(15, { message: 'Họ phải có tối đa 15 ký tự' })
    .regex(
      /^[A-Z][a-zA-Z\s]*$/,
      'Họ phải bắt đầu bằng chữ hoa',
    )
    .transform((value) => sanitizeInput(value)),
  email: z
    .string()
    .min(5, { message: 'Email phải có ít nhất 5 ký tự' })
    .max(255, { message: 'Email phải có tối đa 255 ký tự' })
    .email()
    .transform((value) => sanitizeInput(value)),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .regex(
      PASSWORD_REGEX,
      'Mật khẩu phải bắt đầu bằng chữ hoa, ít nhất 8 ký tự và chứa ký tự đặc biệt và số',
    )
    .transform((value) => sanitizeInput(value)),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email không được để trống' })
    .max(255, { message: 'Email phải có tối đa 255 ký tự' })
    .email()
    .transform((value) => sanitizeInput(value)),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .regex(
      PASSWORD_REGEX,
      'Mật khẩu phải bắt đầu bằng chữ hoa, ít nhất 8 ký tự và chứa ký tự đặc biệt và số',
    )
    .transform((value) => sanitizeInput(value)),
});
