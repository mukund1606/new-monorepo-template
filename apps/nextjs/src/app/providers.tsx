"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "~/components/ui/sonner";
import { createORPC } from "~/orpc/client";
import { ORPCContext } from "~/orpc/context";
import { getQueryClient } from "~/orpc/query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const orpc = createORPC();

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          <ORPCContext value={orpc}>
            {children}
            <Toaster richColors closeButton duration={2000} />
          </ORPCContext>
        </ReactQueryStreamedHydration>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
