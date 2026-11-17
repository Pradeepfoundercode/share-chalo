import * as z from 'zod';

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, { message: 'Email or username is required' })
    .min(3, { message: 'Must be at least 3 characters' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(3, 'Full name must be at least 3 characters'),
  // email: z
  //   .string()
  //   .min(1, 'Email address is required')
  //   .email('Please enter a valid email address'),
  mobile: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9+ ]{10,15}$/, 'Please enter a valid 10-digit mobile number'),
});

export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required')
      .min(6, 'Password must be at least 6 characters'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and Confirm password do not match',
    path: ['confirmPassword'],
  });


