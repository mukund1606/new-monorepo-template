import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
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
    ...loadEnv(mode, path.resolve(process.cwd(), "../../"), ""),
  };

  const { clientEnv } = await import("@acme/env/client");
  await import("@acme/env/server");

  return {
    server: {
      port: 3001,
    },
    base: clientEnv.VITE_BASE_URL,
    plugins: [
      devtools(),
      viteTsConfigPaths(),
      tailwindcss(),
      tanstackStart(),
      nitroV2Plugin(),
      viteReact(),
    ],
  };
});
