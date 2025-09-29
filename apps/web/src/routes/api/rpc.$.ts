import { createServerFileRoute } from "@tanstack/react-start/server";

import { createServerHandler } from "@acme/orpc";

const handler = createServerHandler();

async function handleRequest({ request }: { request: Request }) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {
      reqHeaders: request.headers,
      resHeaders: new Headers(),
    },
  });

  return response ?? new Response("Not Found", { status: 404 });
}

export const ServerRoute = createServerFileRoute("/api/rpc/$").methods({
  GET: handleRequest,
  POST: handleRequest,
  PUT: handleRequest,
  PATCH: handleRequest,
  DELETE: handleRequest,
  HEAD: handleRequest,
});
