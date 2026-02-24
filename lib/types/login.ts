import { SignInSchema, SignUpSchema } from '../zod-schemas';
import { z } from 'zod';

export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type SignInFormData = z.infer<typeof SignInSchema>;
