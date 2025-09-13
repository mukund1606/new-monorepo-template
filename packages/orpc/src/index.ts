import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "~/lib/procedures";
import { authRouter } from "~/routes/auth";

export const appRouter = {
  healthCheck: publicProcedure
    .route({
      method: "GET",
      path: "/health",
    })
    .handler(({ context }) => {
      context.resHeaders?.set("X-API-Version", "1.0.0");
      return "OK";
    }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session.user,
    };
  }),
  auth: authRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
