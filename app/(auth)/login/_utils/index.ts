'use client';

import { SignUpFormData, SignInFormData } from '@/lib/types/login';
import { z } from 'zod';
import { getAuthClient } from '@/lib/auth/authClient';

export function getFieldErrors(
  field: keyof SignUpFormData | keyof SignInFormData,
  errors?: z.core.$ZodIssue[],
) {
  return errors?.filter((error) => error.path.includes(field));
}

export async function signInWithGoogle() {
  try {
    const authClient = getAuthClient();
    await authClient.signIn.social({ provider: 'google', callbackURL: '/' });
  } catch (error) {
    alert(error);
  }
}
