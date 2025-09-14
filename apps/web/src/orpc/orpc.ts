import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import type { AppRouterClient } from "@acme/orpc";

import { getServerUrl, headers } from "~/lib/server-helpers";

const link = new RPCLink({
  url: getServerUrl() + "/rpc",
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
  headers: headers,
});

export const orpcClient: AppRouterClient = createORPCClient(link);

export const orpcTanstackQueryUtils = createTanstackQueryUtils(orpcClient);

export type ORPCTanstackQueryUtils = typeof orpcTanstackQueryUtils;
