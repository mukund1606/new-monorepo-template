import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const headers = createIsomorphicFn()
  .server(() => {
    const headers = getRequestHeaders();
    headers.set("x-orpc-source", "tss-react-server");
    return headers;
  })
  .client(() => {
    const headers = new Headers();
    headers.set("x-orpc-source", "tss-react-client");
    return headers;
  });
