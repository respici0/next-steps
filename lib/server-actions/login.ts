"use server";

import { getAuthServer } from "../auth/authServer";
import dbConnect from "../db/mongo";
import { SignInSchema, SignUpSchema } from "../zod-schemas";
import { z } from "zod";

import type { SignInFormData, SignUpFormData } from "../types/login";
import { headers } from "next/headers";

export async function createUserWithEmail(formData: FormData) {
  try {
    const db = await dbConnect();
    const authServer = getAuthServer(db.connection.getClient());

    const newUser: SignUpFormData = {
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      confirmPassword: formData.get("confirmPassword")?.toString() || "",
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
      throw new Error(
        `Sign Up Failed${error instanceof Error ? `: ${error.message}` : ""}`,
      );
    }
  }
}

export async function loginUser(formData: FormData) {
  try {
    const db = await dbConnect();
    const authServer = getAuthServer(db.connection.getClient());

    const newUser: SignInFormData = {
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    };

    console.log(newUser);

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
      throw new Error(
        `Sign Up Failed${error instanceof Error ? `: ${error.message}` : ""}`,
      );
    }
  }
}

export async function getUserSession() {
  const db = await dbConnect();
  const authServer = getAuthServer(db.connection.getClient());

  return await authServer.api.getSession({
    headers: await headers(),
  });
}
