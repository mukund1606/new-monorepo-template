import "server-only";

import { createServerHandler, createServerRouter } from "@acme/orpc";

import { getHeaders } from "~/lib/helpers";

export const handler = createServerHandler();

/**
 * Export a server-side caller for the oRPC API.
 * @example
 * const res = await api.post.all();
 *       ^? Post[]
 */
export const api = createServerRouter(getHeaders);
