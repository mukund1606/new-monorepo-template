import { createAuthClient } from "better-auth/react";

export const getAuthClient = (baseURL: string) => {
  return createAuthClient({
    baseURL: baseURL,
  });
};
