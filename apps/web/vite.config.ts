import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ mode }) => {
  process.env = {
    ...process.env,
    ...import.meta.env,
    ...loadEnv(mode, process.cwd(), ""),
  };

  await import("./src/env");

  return {
    server: {
      warmup: {
        clientFiles: ["./src/server.tsx"],
      },
    },
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
