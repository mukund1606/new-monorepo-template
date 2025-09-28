import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () => {
        return new Response("OK", { status: 200 });
      },
    },
  },
});
