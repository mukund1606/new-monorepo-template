import baseConfig, {
  drizzleEslintConfig,
  restrictEnvAccess,
} from "@acme/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
const config = [...baseConfig, ...restrictEnvAccess, ...drizzleEslintConfig];

export default config;
