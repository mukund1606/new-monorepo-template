import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { BatchHandlerPlugin } from "@orpc/server/plugins";

import { protectedProcedure, publicProcedure } from "./lib/procedures";
import { authRouter } from "./routes/auth";

export const appRouter = {
  healthCheck: publicProcedure.handler(({ context }) => {
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
export type AppRouterClient = RouterClient<AppRouter>;

export const createServerHandler = () => {
  return new RPCHandler(appRouter, {
    plugins: [new BatchHandlerPlugin()],
  });
};

export const createServerRouter = (headers: () => Promise<Headers>) => {
  return createRouterClient(appRouter, {
    context: async () => {
      const reqHeaders = await headers();
      return {
        reqHeaders,
        resHeaders: new Headers(),
      };
    },
  });
};
