'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import OrDivider from './OrDivider';
import { z } from 'zod';
import { createUserWithEmail } from '@/lib/server-actions/login';
import ErrorList from './ErrorList';
import { redirect } from 'next/navigation';
import { getFieldErrors, signInWithGoogle } from '../_utils';

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const [formErrors, setFormErrors] = useState<z.core.$ZodIssue[] | undefined>(undefined);

  const signUpWithEmail = async (previousState: FormData, formData: FormData) => {
    previousState = formData;
    let newValidationErrors: typeof formErrors = undefined;

    try {
      newValidationErrors = await createUserWithEmail(formData);
      setFormErrors(newValidationErrors);
    } catch (error) {
      alert(error);
      return previousState;
    } finally {
      if (!newValidationErrors) {
        redirect('/');
      }
      return previousState;
    }
  };

  const [formActionState, formAction, pending] = useActionState(signUpWithEmail, new FormData());

  const emailFieldErrors = getFieldErrors('email', formErrors);
  const passwordFieldErrors = getFieldErrors('password', formErrors);
  const confirmPasswordFieldErrors = getFieldErrors('confirmPassword', formErrors);

  return (
    <>
      <CardHeader className="pb-6">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field data-invalid={!!emailFieldErrors?.length}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue={formActionState.get('email')?.toString() || ''}
                aria-invalid={!!emailFieldErrors?.length}
              />
              <ErrorList errors={emailFieldErrors} />
            </Field>
            <Field data-invalid={!!passwordFieldErrors?.length}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                required
                defaultValue={formActionState.get('password')?.toString() || ''}
                aria-invalid={!!passwordFieldErrors?.length}
              />
              <ErrorList
                placeholder="Must be at least 8 characters long."
                errors={passwordFieldErrors}
              />
            </Field>
            <Field data-invalid={!!confirmPasswordFieldErrors?.length}>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                name="confirmPassword"
                aria-invalid={!!confirmPasswordFieldErrors?.length}
                defaultValue={formActionState.get('confirmPassword')?.toString() || ''}
              />
              <ErrorList
                placeholder="Please confirm your password."
                errors={confirmPasswordFieldErrors}
              />
            </Field>
            <FieldGroup>
              <Field className="gap-8">
                <Button type="submit" disabled={pending} className="flex flex-row">
                  {pending && <Spinner />} Create Account
                </Button>
                <OrDivider />
                <Button
                  variant="outline"
                  type="button"
                  disabled={pending}
                  className="flex flex-row"
                  onClick={signInWithGoogle}
                >
                  {pending && <Spinner />} Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign in
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </>
  );
}
