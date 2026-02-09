import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';

import type { MongoClient } from 'mongodb';
import { getBaseUrl } from './getBaseUrl';

let authServer: ReturnType<typeof betterAuth> | undefined = undefined;

export function getAuthServer(client: MongoClient) {
  if (!authServer) {
    authServer = betterAuth({
      baseURL: getBaseUrl(),
      database: mongodbAdapter(client.db(undefined), {
        client,
        usePlural: true,
      }),
      user: {
        additionalFields: {
          role: {
            type: 'string',
            required: false,
            defaultValue: 'user',
            input: false,
          },
          isActive: {
            type: 'boolean',
            required: true,
            defaultValue: true,
            input: false,
          },
        },
      },
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID_WEB || '',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
      plugins: [nextCookies()],
    });
  }

  return authServer;
}
