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

  const { env } = await import("./src/env");

  const nitroPlugin = () => {
    if (env.NODE_ENV === "production") {
      return nitro({
        config: {
          preset: "bun",
        },
      });
    }
  };

  return {
    server: {
      port: 3000,
    },
    plugins: [
      viteTsConfigPaths(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      devtools(),
      nitroPlugin(),
    ],
  };
});
