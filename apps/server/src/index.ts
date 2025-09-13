import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { RequestHeadersPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { auth } from "@acme/auth";
import { appRouter } from "@acme/orpc";

import { env } from "~/env";

const app = new Hono();

app.use(logger());

app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new RequestHeadersPlugin(),
    new ResponseHeadersPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      // @ts-expect-error - NOTE: Types are not compatible
      specGenerateOptions: async () => {
        const authOpenAPISchema = await auth.api.generateOpenAPISchema();
        authOpenAPISchema.paths = Object.fromEntries(
          Object.entries(authOpenAPISchema.paths).map(([path, method]) => {
            for (const key of Object.keys(method)) {
              const keyMethod = method[key as keyof typeof method];
              if (keyMethod?.tags?.includes("Default")) {
                keyMethod.tags = ["Default-auth"];
              }
            }
            return [`/auth${path}`, method];
          }),
        );
        return {
          ...authOpenAPISchema,
          servers: [
            {
              url: "/api",
            },
          ],
          info: {
            title: "MY Hono API",
            version: "1.0.0",
            description: "My Hono API",
          },
        };
      },
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const rpcHandler = new RPCHandler(appRouter, {
  plugins: [new RequestHeadersPlugin(), new ResponseHeadersPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use("/*", async (c, next) => {
  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: {
      reqHeaders: c.req.raw.headers,
      resHeaders: c.res.headers,
    },
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api",
    context: {
      reqHeaders: c.req.raw.headers,
      resHeaders: c.res.headers,
    },
  });

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
