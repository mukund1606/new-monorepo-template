import path from "node:path";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  includeIgnoreFile(path.join(import.meta.dirname, "../../.gitignore")),
  globalIgnores([
    ".vinxi",
    "build",
    "dist",
    "node_modules",
    ".output",
    ".nitro",
    ".tanstack",
    ".turbo",
    ".astro",
  ]),
  pluginReact.configs.flat.recommended ?? {},
  pluginReactHooks.configs["recommended-latest"],
  pluginJsxA11y.flatConfigs.strict,
  ...pluginRouter.configs["flat/recommended"],
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react: pluginReact,
    },
    rules: {
      // React
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react/react-in-jsx-scope": "off",

      "react/no-unescaped-entities": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
  },
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    ...js.configs.recommended,
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
]);
