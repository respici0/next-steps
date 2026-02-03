import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import type { MongoClient } from "mongodb";

let authServer: ReturnType<typeof betterAuth> | undefined = undefined;

export function getAuthServer(client: MongoClient) {
  if (!authServer) {
    authServer = betterAuth({
      baseURL: process.env.BETTER_AUTH_URL,
      database: mongodbAdapter(client.db(), {
        client,
      }),
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID_WEB || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
      plugins: [nextCookies()],
    });
  }

  return authServer;
}
