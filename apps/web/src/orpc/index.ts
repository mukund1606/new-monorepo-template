import type { RouterUtils } from "@orpc/tanstack-query";
import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin } from "@orpc/client/plugins";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import type { AppRouterClient, SafeAppRouterClient } from "@acme/orpc";

import { env } from "~/env";
import { headers } from "~/lib/server-helpers";

const getORPCClient = createIsomorphicFn()
  .server((): AppRouterClient => {
    // Use localhost:3000/rpc for request is made via server (nodejs) for faster response time
    const link = new RPCLink({
      url: "http://localhost:3000/rpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      headers: headers(),
      plugins: [
        new BatchLinkPlugin({
          groups: [
            {
              condition: () => true,
              context: {},
            },
          ],
        }),
      ],
    });
    return createORPCClient<AppRouterClient>(link);
  })
  .client((): AppRouterClient => {
    // Use the VITE_SERVER_URL with request is made via client (browser)
    const link = new RPCLink({
      url: `${env.VITE_SERVER_URL}/rpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      headers: headers(),
      plugins: [
        new BatchLinkPlugin({
          groups: [
            {
              condition: () => true,
              context: {},
            },
          ],
        }),
      ],
    });
    return createORPCClient<AppRouterClient>(link);
  });

export const client: AppRouterClient = getORPCClient();
export const safeClient: SafeAppRouterClient = createSafeClient(client);

export const orpc = createTanstackQueryUtils(client);

export type ORPCReactUtils = RouterUtils<AppRouterClient>;
