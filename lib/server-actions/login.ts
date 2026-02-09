'use server';

import { getAuthServer } from '../auth/authServer';
import dbConnect from '../db/mongo';
import { SignInSchema, SignUpSchema } from '../zod-schemas';
import { z } from 'zod';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { SignInFormData, SignUpFormData } from '../types/login';

async function getAuth() {
  const db = await dbConnect();
  return getAuthServer(db.connection.getClient());
}

export async function createUserWithEmail(formData: FormData) {
  try {
    const authServer = await getAuth();

    const newUser: SignUpFormData = {
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      confirmPassword: formData.get('confirmPassword')?.toString() || '',
    };

    SignUpSchema.parse(newUser);

    await authServer.api.signUpEmail({
      body: {
        email: newUser.email,
        password: newUser.password,
        name: newUser.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues;
    } else {
      throw new Error(`Sign Up Failed${error instanceof Error ? `: ${error.message}` : ''}`);
    }
  }
}

export async function loginUser(formData: FormData) {
  try {
    const authServer = await getAuth();

    const newUser: SignInFormData = {
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || '',
    };

    SignInSchema.parse(newUser);

    await authServer.api.signInEmail({
      body: {
        email: newUser.email,
        password: newUser.password,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues;
    } else {
      throw new Error(`Sign In Failed${error instanceof Error ? `: ${error.message}` : ''}`);
    }
  }
}

export async function getUserSession() {
  const authServer = await getAuth();

  return await authServer.api.getSession({
    headers: await headers(),
  });
}

export async function logoutUser() {
  const authServer = await getAuth();

  await authServer.api.signOut({
    headers: await headers(),
  });
  redirect('/login');
}
