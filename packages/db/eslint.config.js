import baseConfig, { restrictEnvAccess } from "@acme/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
const config = [...baseConfig, ...restrictEnvAccess];

export default config;
