import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter as createTanStackRouter,
  ErrorComponent,
} from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import DefaultLoading from "~/components/default-loading";
import NotFound from "~/components/not-found";
import { ORPCContext } from "~/orpc/context";
import { orpc } from "~/orpc/orpc";
import { getQueryClient } from "~/orpc/query-client";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = getQueryClient();

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
      orpc,
      currentSession: null,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultStaleTime: 0,
    defaultPreload: "intent",
    defaultViewTransition: true,
    defaultPendingComponent: DefaultLoading,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <QueryClientProvider client={queryClient}>
          <ORPCContext.Provider value={orpc}>{props.children}</ORPCContext.Provider>
        </QueryClientProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
