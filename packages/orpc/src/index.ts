import type { SafeClient } from "@orpc/client";
import type { InferRouterInputs, InferRouterOutputs, RouterClient } from "@orpc/server";
import { EventPublisher } from "@orpc/client";
import { RPCHandler } from "@orpc/server/fetch";
import {
  BatchHandlerPlugin,
  RequestHeadersPlugin,
  ResponseHeadersPlugin,
} from "@orpc/server/plugins";
import z from "zod";

import { protectedProcedure, publicProcedure } from "~/procedures";
import { authRouter } from "~/routes/auth";

type EventData = {
  message: string;
};

const publisher = new EventPublisher<Record<string, EventData>>();

const chat = {
  onMessage: publicProcedure
    .input(z.object({ channel: z.string() }))
    .handler(async function* ({ input, signal }) {
      try {
        console.log("Subscribed to channel:", input.channel);
        for await (const payload of publisher.subscribe(input.channel, { signal })) {
          yield payload.message;
        }
        signal?.addEventListener("abort", () => {
          console.log("Signal aborted");
        });
      } finally {
        console.log("Subscription ended for channel:", input.channel);
      }
    }),
  sendMessage: publicProcedure
    .input(z.object({ channel: z.string(), message: z.string() }))
    .handler(({ input }) => {
      console.log("Sending message:", input.message, "to channel:", input.channel);
      publisher.publish(input.channel, {
        message: input.message,
      });
    }),
};

export const appRouter = {
  healthCheck: publicProcedure
    .route({
      method: "GET",
      path: "/health",
    })
    .handler(() => {
      return "OK";
    }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session.user,
    };
  }),
  auth: authRouter,
  chat,
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
