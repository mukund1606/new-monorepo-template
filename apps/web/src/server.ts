import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

import { createRouter } from "./router";

const fetch = createStartHandler({
  createRouter,
})((req) => {
  return defaultStreamHandler(req);
});

export default fetch;
