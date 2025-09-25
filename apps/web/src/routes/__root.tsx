import type { QueryClient } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import type { Session } from "@acme/auth";

import type { ORPCTanstackQueryUtils } from "~/orpc/orpc";
import Loader from "~/components/default-loading";
import Header from "~/components/header";
import { Toaster } from "~/components/ui/sonner";
import appCss from "../index.css?url";

export type RouterAppContext = {
  orpc: ORPCTanstackQueryUtils;
  queryClient: QueryClient;
  currentSession: Session | null;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  beforeLoad: async ({ context }) => {
    const { orpc, queryClient } = context;
    const user = await queryClient.fetchQuery(orpc.auth.getSession.queryOptions());
    if (user?.session) {
      return {
        currentSession: {
          session: user.session,
          user: user.user,
        },
      };
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "My App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootDocument,
  wrapInSuspense: true,
});

function RootDocument() {
  const isFetching = useRouterState({ select: (s) => s.isLoading });
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <div className="grid h-svh grid-rows-[auto_1fr]">
          <Header />
          {isFetching ? <Loader /> : <Outlet />}
        </div>
        <Toaster richColors />
        <TanStackDevtools
          config={{ defaultOpen: false, theme: "dark" }}
          plugins={[
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "Drizzle Studio",
              render: () => (
                <iframe
                  title="Drizzle Studio"
                  src="https://local.drizzle.studio"
                  style={{
                    flexGrow: 1,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              ),
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
