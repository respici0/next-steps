'use client';

import { Button } from '@/components/ui/button';
import { useState, useActionState } from 'react';
import { z } from 'zod';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { loginUserWithEmail } from '@/lib/server-actions/login';
import OrDivider from './OrDivider';
import { redirect } from 'next/navigation';
import { getFieldErrors, signInWithGoogle } from '../_utils';

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const [formErrors, setFormErrors] = useState<z.core.$ZodIssue[] | undefined>(undefined);

  const signInWithEmail = async (previousState: FormData, formData: FormData) => {
    previousState = formData;
    let newValidationErrors: typeof formErrors = undefined;

    try {
      newValidationErrors = await loginUserWithEmail(formData);
      setFormErrors(newValidationErrors);
    } catch (error) {
      alert(error);
      return previousState;
    }
    if (!newValidationErrors) {
      redirect('/');
    }
    return previousState;
  };

  const [formActionState, formAction, pending] = useActionState(signInWithEmail, new FormData());

  const emailFieldErrors = getFieldErrors('email', formErrors);
  const passwordFieldErrors = getFieldErrors('password', formErrors);

  return (
    <>
      <CardHeader className="pb-8">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field data-invalid={!!emailFieldErrors?.length}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                aria-invalid={!!emailFieldErrors?.length}
                defaultValue={formActionState.get('email')?.toString() || ''}
              />
            </Field>
            <Field data-invalid={!!passwordFieldErrors?.length}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {/* <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a> */}
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                required
                aria-invalid={!!passwordFieldErrors?.length}
                defaultValue={formActionState.get('password')?.toString() || ''}
              />
            </Field>

            <Field className="gap-8">
              <Button type="submit" className="flex flex-row">
                {pending && <Spinner />}Login
              </Button>
              <OrDivider />
              <Button variant="outline" type="button" onClick={signInWithGoogle}>
                Login with Google
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </>
  );
}
