import { createAuthClient } from "better-auth/react";

import { clientEnv } from "@acme/env/client";

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_SERVER_URL,
});
