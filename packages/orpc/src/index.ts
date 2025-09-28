import fs from "fs/promises";
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

type Messages = Array<string>;

type FileData = Record<string, Messages>;

const getFileData = async () => {
  const path = "messages.json";

  try {
    await fs.access(path);
  } catch {
    await fs.writeFile(path, JSON.stringify({}, null, 2));
  }

  const fileContent = await fs.readFile(path, "utf-8");
  const data = JSON.parse(fileContent) as FileData;
  return data;
};

const setFileData = async (data: FileData) => {
  const path = "messages.json";
  await fs.writeFile(path, JSON.stringify(data, null, 2));
};

const publisher = new EventPublisher<Record<string, undefined>>();

const chat = {
  onMessage: publicProcedure
    .input(z.object({ channel: z.string() }))
    .handler(async function* ({ input, signal }) {
      for await (const _ of publisher.subscribe(input.channel, { signal })) {
        console.log("Subscribed to channel:", input.channel);
        const data = await getFileData();
        yield data[input.channel];
      }
      console.log("Subscription ended for channel:", input.channel);
    }),
  sendMessage: publicProcedure
    .input(z.object({ channel: z.string(), message: z.string() }))
    .handler(async ({ input }) => {
      console.log("Sending message:", input.message, "to channel:", input.channel);
      const data = await getFileData();
      data[input.channel] ??= [];
      data[input.channel] = [...(data[input.channel] ?? []), input.message];
      await setFileData(data);
      publisher.publish(input.channel, undefined);
      console.log("Published message, current messages:", data[input.channel]);
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
