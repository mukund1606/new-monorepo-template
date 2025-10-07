import { getAuthClient } from "@acme/auth/client";

import { env } from "~/env";

export const authClient = getAuthClient(env.VITE_SERVER_URL);
