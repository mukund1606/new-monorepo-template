import { getAuthClient } from "@acme/auth/client";

import { getServerUrl } from "./server-helpers";

export const authClient = getAuthClient(getServerUrl());
