import path from "node:path";
import { includeIgnoreFile } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  includeIgnoreFile(path.join(import.meta.dirname, "../../.gitignore")),
  globalIgnores([".next", "build", "dist", "node_modules", ".turbo"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      // @ts-ignore: Types Error
      "@next/next": nextPlugin,
    },
    // @ts-ignore
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // TypeError: context.getAncestors is not a function
      "@next/next/no-duplicate-head": "off",
    },
  },
]);
