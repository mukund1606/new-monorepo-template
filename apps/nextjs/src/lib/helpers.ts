import { env } from "@acme/env";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  // eslint-disable-next-line no-restricted-properties, @typescript-eslint/restrict-template-expressions
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export async function getHeaders() {
  const reqHeaders = new Headers();
  if (typeof window !== "undefined") {
    reqHeaders.set("x-orpc-source", "nextjs-react");
    return reqHeaders;
  }

  const { headers } = await import("next/headers");
  const headersList = await headers();
  for (const [key, value] of headersList) {
    reqHeaders.set(key, value);
  }
  reqHeaders.set("x-orpc-source", "rsc");
  return reqHeaders;
}
