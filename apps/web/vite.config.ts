import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  // // eslint-disable-next-line no-restricted-properties
  // process.env = {
  //   // eslint-disable-next-line no-restricted-properties
  //   ...process.env,
  //   ...import.meta.env,
  // };

  // const { env } = await import("@acme/env");

  return {
    // base: env.VITE_BASE_URL,
    plugins: [
      devtools(),
      viteTsConfigPaths(),
      tailwindcss(),
      tanstackStart({
        customViteReactPlugin: true,
        target: "node-server",
      }),
      viteReact(),
    ],
  };
});
