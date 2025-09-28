/* eslint-disable no-restricted-properties */
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ mode }) => {
  process.env = {
    ...process.env,
    ...import.meta.env,
    ...loadEnv(mode, path.resolve(process.cwd(), "../../"), ""),
  };

  await import("./src/env");

  return {
    server: {
      port: 3000,
    },
    plugins: [
      devtools(),
      viteTsConfigPaths(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      nitro({
        config: {
          ignore: ["bun_server.ts"],
          preset: "bun",
        },
      }),
    ],
  };
});
