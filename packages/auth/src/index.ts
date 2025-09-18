import { betterAuth } from "better-auth";

import { authConfig } from "~/auth-config";

export const auth = betterAuth(authConfig) as unknown as ReturnType<
  typeof betterAuth<typeof authConfig>
>;

export type Auth = typeof auth;
export type Session = Auth["$Infer"]["Session"];
