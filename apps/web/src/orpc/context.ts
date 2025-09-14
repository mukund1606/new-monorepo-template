import type { RouterUtils } from "@orpc/tanstack-query";
import { createContext, useContext } from "react";

import type { AppRouterClient } from "@acme/orpc";

type ORPCReactUtils = RouterUtils<AppRouterClient>;

export const ORPCContext = createContext<ORPCReactUtils | undefined>(undefined);

export function useORPC(): ORPCReactUtils {
  const orpc = useContext(ORPCContext);
  if (!orpc) {
    throw new Error("ORPCContext is not set up properly");
  }
  return orpc;
}
