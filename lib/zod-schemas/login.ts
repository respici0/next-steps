import { z } from 'zod';

export const EmailSchema = z.email();

export const FormPasswordSchema = z.string();

export const SignUpSchema = z
  .object({
    email: EmailSchema,
    password: FormPasswordSchema.min(8),
    confirmPassword: FormPasswordSchema.min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const SignInSchema = z.object({
  email: EmailSchema,
  password: FormPasswordSchema,
});
