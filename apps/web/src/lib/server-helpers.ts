import { createIsomorphicFn, createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { clientEnv } from "@acme/env/client";

// import { serverEnv } from "@acme/env/server";

const getRequestHeaders = createServerFn({ method: "GET" }).handler(() => {
  const request = getWebRequest();
  const headers = new Headers(request.headers);

  return Object.fromEntries(headers);
});

export const headers = createIsomorphicFn()
  .server(async () => {
    const headers = await getRequestHeaders();
    return {
      ...headers,
      "x-orpc-source": "tss-react-server",
    };
  })
  .client(() => ({
    "x-orpc-source": "tss-react-client",
  }));

export const getServerUrl = createIsomorphicFn()
  .server(() => {
    console.log("server", clientEnv.VITE_SERVER_URL);
    return clientEnv.VITE_SERVER_URL;
    // return serverEnv.IS_DOCKER_HOST === "true"
    //   ? "http://server:3000"
    //   : "http://localhost:3000";
  })
  .client(() => {
    console.log("client", clientEnv.VITE_SERVER_URL);
    return clientEnv.VITE_SERVER_URL;
  });
