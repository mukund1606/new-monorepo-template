import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn, createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import type { AppRouterClient } from "@acme/orpc";

import { env } from "~/env";

const getRequestHeaders = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();
  const headers = new Headers(request?.headers);

  return Object.fromEntries(headers);
});

const headers = createIsomorphicFn()
  .server(async () => {
    const headers = await getRequestHeaders();
    return {
      ...headers,
      "x-orpc-source": "tss-react-server",
    };
  })
  .client(() => ({
    "x-orpc-source": "tss-react-client",
  }));

const link = new RPCLink({
  url: env.VITE_SERVER_URL + "/rpc",
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
