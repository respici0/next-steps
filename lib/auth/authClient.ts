"use client";

import { createAuthClient } from "better-auth/client";

let authClient: ReturnType<typeof createAuthClient> | undefined = undefined;

export function getAuthClient() {
  if (!authClient) {
    authClient = createAuthClient({
      baseURL: process.env.BETTER_AUTH_URL,
    });
  }

  return authClient;
}
