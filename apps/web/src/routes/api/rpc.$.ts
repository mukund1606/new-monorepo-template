import { createFileRoute } from "@tanstack/react-router";

import { createServerHandler } from "@acme/orpc";

import { env } from "~/env";

const handler = createServerHandler();

async function handleRequest({ request }: { request: Request }) {
  if (env.NODE_ENV === "development") {
    request = new Request(request.url, {
      signal: new AbortController().signal,
      method: request.method,
      body: request.body,
      headers: request.headers,
      cache: request.cache,
      credentials: request.credentials,
      integrity: request.integrity,
      keepalive: request.keepalive,
      mode: request.mode,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      // @ts-expect-error NOTE: duplex, destination and bodyUsed properties are not typed in the RequestInit interface
      // NOTE: duplex = half -> required for streaming mode
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      duplex: request.duplex,
      destination: request.destination,
      bodyUsed: request.bodyUsed,
    });
  }
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {
      reqHeaders: request.headers,
      resHeaders: new Headers(),
    },
  });

  return response ?? new Response("Not Found", { status: 404 });
}

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      GET: handleRequest,
      POST: handleRequest,
      PUT: handleRequest,
      PATCH: handleRequest,
      DELETE: handleRequest,
      HEAD: handleRequest,
    },
  },
});
