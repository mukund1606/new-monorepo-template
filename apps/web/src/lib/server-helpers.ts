import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

export const headers = createIsomorphicFn()
  .server(() => {
    const h = getHeaders();
    const headers = new Headers();
    for (const [key, value] of Object.entries(h)) {
      headers.set(key, value ?? "");
    }
    headers.set("x-orpc-source", "tss-react-server");
    return headers;
  })
  .client(() => {
    const headers = new Headers();
    headers.set("x-orpc-source", "tss-react-client");
    return headers;
  });
