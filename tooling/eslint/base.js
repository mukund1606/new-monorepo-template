/// <reference types="./types.d.ts" />

import * as path from "node:path";
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import pluginDrizzle from "eslint-plugin-drizzle";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import turboPlugin from "eslint-plugin-turbo";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

/**
 * All packages that leverage t3-env should use this rule
 */
export const restrictEnvAccess = defineConfig(
  { ignores: ["**/env.ts", "**/env.client.ts", "**/env.server.ts"] },
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Use `import { env } from '~/env'` instead to ensure validated types.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          name: "process",
          importNames: ["env"],
          message: "Use `import { env } from '~/env'` instead to ensure validated types.",
        },
      ],
    },
  },
);

/**
 * All packages that leverage drizzle should use this rule
 */
export const drizzleEslintConfig = defineConfig(
  { ignores: ["**/env.ts"] },
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    plugins: {
      drizzle: pluginDrizzle,
    },
    rules: {
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
    },
  },
);

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
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylistic,
  tseslint.configs.stylisticTypeChecked,
  pluginPrettier,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      import: pluginImport,
      turbo: turboPlugin,
    },
    rules: {
      ...turboPlugin.configs.recommended.rules,

      // TypeScript
      "@typescript-eslint/array-type": ["warn", { default: "generic" }],
      // "id-length": ["warn", { min: 2, exceptions: ["_"] }],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { projectService: true } },
  },
]);
