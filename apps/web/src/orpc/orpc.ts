import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import type { AppRouterClient } from "@acme/orpc";

import { headers } from "~/lib/server-helpers";

export const getORPCUtils = (baseURL: string) => {
  const link = new RPCLink({
    url: baseURL + "/rpc",
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
    headers: headers,
  });

  const orpcClient: AppRouterClient = createORPCClient(link);

  return createTanstackQueryUtils(orpcClient);
};

export type ORPCTanstackQueryUtils = ReturnType<typeof getORPCUtils>;
