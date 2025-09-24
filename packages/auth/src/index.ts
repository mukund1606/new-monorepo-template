import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";

import { authConfig } from "~/auth-config";

export const auth = betterAuth(authConfig) as unknown as ReturnType<
  typeof betterAuth<typeof authConfig>
>;

export type Auth = typeof auth;
export type Session = Auth["$Infer"]["Session"];
export const authHandler = toNextJsHandler(auth.handler);
