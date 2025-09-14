import { createAuthClient } from "better-auth/react";

import { env } from "@acme/env";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
});
