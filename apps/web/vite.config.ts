import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ mode }) => {
  // eslint-disable-next-line no-restricted-properties
  process.env = {
    // eslint-disable-next-line no-restricted-properties
    ...process.env,
    ...import.meta.env,
    ...loadEnv(mode, process.cwd(), ""),
  };

  const { clientEnv } = await import("@acme/env/client");

  return {
    base: clientEnv.VITE_BASE_URL,
    plugins: [
      devtools(),
      viteTsConfigPaths(),
      tailwindcss(),
      tanstackStart({
        customViteReactPlugin: true,
        target: "bun",
      }),
      viteReact(),
    ],
  };
});
