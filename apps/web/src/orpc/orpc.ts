import type { RouterUtils } from "@orpc/tanstack-query";
import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin } from "@orpc/client/plugins";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import type { AppRouterClient, SafeAppRouterClient } from "@acme/orpc";
import { appRouter } from "@acme/orpc";

import { headers } from "~/lib/server-helpers";

const getORPCClient = createIsomorphicFn()
  .server((): AppRouterClient => {
    return createRouterClient(appRouter, {
      context: () => ({
        reqHeaders: headers(),
        resHeaders: new Headers(),
      }),
    });
  })
  .client((): AppRouterClient => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
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
