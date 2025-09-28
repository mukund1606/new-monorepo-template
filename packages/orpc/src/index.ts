import type { SafeClient } from "@orpc/client";
import type { InferRouterInputs, InferRouterOutputs, RouterClient } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import {
  BatchHandlerPlugin,
  RequestHeadersPlugin,
  ResponseHeadersPlugin,
} from "@orpc/server/plugins";

import { protectedProcedure, publicProcedure } from "~/procedures";
import { authRouter } from "~/routes/auth";

export const appRouter = {
  healthCheck: publicProcedure
    .route({
      method: "GET",
      path: "/health",
    })
    .handler(({ context }) => {
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
export type SafeAppRouterClient = SafeClient<AppRouterClient>;

export type RouterOutputs = InferRouterOutputs<AppRouter>;
export type RouterInputs = InferRouterInputs<AppRouter>;

export const createServerHandler = () => {
  return new RPCHandler(appRouter, {
    plugins: [
      new BatchHandlerPlugin(),
      new ResponseHeadersPlugin(),
      new RequestHeadersPlugin(),
    ],
  });
};
