import { getAuthClient } from "@acme/auth/client";

import { getBaseUrl } from "./helpers";

export const authClient = getAuthClient(getBaseUrl());
