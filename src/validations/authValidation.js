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

