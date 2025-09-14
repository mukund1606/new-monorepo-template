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

export const getServerUrl = () => {
  let URL = clientEnv.VITE_SERVER_URL;
  if (typeof window !== "undefined") {
    URL = clientEnv.VITE_SERVER_URL;
    console.log("Client URL", URL);
    return URL;
  }
  URL = "http://localhost:3000";
  console.log("Server URL", URL);
  return URL;
};
