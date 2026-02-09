'use client';

import { createAuthClient } from 'better-auth/client';
import { getBaseUrl } from './getBaseUrl';

let authClient: ReturnType<typeof createAuthClient> | undefined = undefined;

export function getAuthClient() {
  if (!authClient) {
    authClient = createAuthClient({
      baseURL: getBaseUrl(),
    });
  }

  return authClient;
}
